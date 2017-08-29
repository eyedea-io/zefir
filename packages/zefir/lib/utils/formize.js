import React, {Component} from 'react'
import PropTypes from 'prop-types'
import coercer from 'coercer'
import get from 'lodash.get'
import {observer} from 'mobx-react'
import {validate} from 'syncano-validate'
import {extendObservable, observable, isArrayLike} from 'mobx'

export default function formize ({
  formName,
  fields,
  rules = {},
  messages = {},
  permament = true
}) {
  return function (ComposedComponent) {
    class Form extends Component {
      static propTypes = {
        services: PropTypes.object,
        stores: PropTypes.object
      }

      static contextTypes = {
        services: PropTypes.object,
        stores: PropTypes.object
      }

      constructor (props, context) {
        super(props, context)

        if (!formName && permament) {
          throw new Error('Property "formName" is required')
        }

        if (!context.stores.forms) {
          extendObservable(context.stores, {forms: observable.map()})
        }

        const form = {
          fields: {},
          errors: observable.map({}),
          messages,
          rules
        }

        switch (typeof fields) {
          case 'function':
            form.fields = fields({...props, ...context})
            break
          case 'object':
            form.fields = fields
            break
          default:
            throw new Error(
              'Property "fields" is required and must be a function or an object'
            )
        }

        form.fields = Object.keys(form.fields).reduce((obj, name) => {
          if (Array.isArray(form.fields[name])) {
            return {
              ...obj,
              [name]: form.fields[name].map(item => ({
                name,
                value: '',
                'data-form-item-id': Math.random().toString(36).substr(2, 5),
                onChange: e => this.setValue(e),
                ...item
              }))
            }
          }

          return {
            ...obj,
            [name]: {
              name,
              value: '',
              onChange: e => this.setValue(e),
              ...form.fields[name]
            }
          }
        }, {})

        if (!context.stores.forms.get(formName) || !permament) {
          context.stores.forms.set(formName, form)
        }

        this.form = context.stores.forms.get(formName)
        this.submit = this.submit.bind(this)
        this.setValue = this.setValue.bind(this)
      }

      createField (data) {
        if (Array.isArray(data)) {
          return data.map(item => ({
            value: '',
            'data-form-item-id': Math.random().toString(36).substr(2, 5),
            onChange: e => this.setValue(e),
            ...item
          }))
        }

        return {
          value: '',
          'data-form-item-id': Math.random().toString(36).substr(2, 5),
          onChange: e => this.setValue(e),
          ...data
        }
      }

      setValue (event, val) {
        const name = get(event, 'target.name', event)
        let entity = get(this.form.fields, name)

        if (entity === undefined) {
          const [fieldName, fieldId] = name.split('.')

          entity = this.form.fields[fieldName]

          entity = entity.find(item => item['data-form-item-id'] === fieldId)
        }

        const type = get(event, 'target.type', entity.type)

        const isFile = type === 'file'
        const isCheckbox = type === 'checkbox'
        const isRadio = type === 'radio'

        const value = get(event, 'target.value', val)
        const file = get(event, 'target.files.0', undefined)
        const checked = isCheckbox || isRadio
          ? coercer(get(event, 'target.checked'))
          : undefined

        const isArrayField = isArrayLike(entity)

        if (isArrayField && isRadio) {
          entity.forEach((item, i) => {
            entity[i].checked = item.value === value ? checked : false
          })
        } else if (isArrayField && isCheckbox) {
          entity.forEach((item, i) => {
            if (item.value === value) {
              entity[i].checked = checked
            }
          })
        } else if (isArrayField) {
          entity.map((item, i) => {
            if (item['data-form-item-id'] === event.target.dataset.formItemId) {
              const field = entity[i]

              field.value = coercer(value)

              if (isFile) {
                field['data-file'] = file
                field.value = ''
              }
            }
          })
        }

        entity.value = coercer(value)
        entity.checked = checked !== undefined ? checked : undefined

        if (file !== undefined) {
          entity['data-file'] = file
          entity.value = ''
        }
      }

      getValue (id, fields) {
        const isArray = /\[\]/.test(id) || isArrayLike(fields[id])

        if (isArray) {
          const item = fields[id][0]

          if (item === undefined) {
            return []
          } else if (item.type !== 'radio') {
            if (item.type === 'checkbox') {
              return fields[id]
                .map(item => (item.checked ? item.value : undefined))
                .filter(Boolean)
            }

            return fields[id].map(
              item => (item['data-file'] ? item['data-file'] : item.value)
            )
          }
        }

        const hasType = Object.prototype.hasOwnProperty.call(fields[id], 'type')
        const hasValue = Object.prototype.hasOwnProperty.call(
          fields[id],
          'value'
        )
        const type = fields[id].type

        return hasType && type === 'checkbox'
          ? fields[id].checked
          : fields[id]['data-file']
              ? fields[id]['data-file']
              : hasValue ? fields[id].value : fields[id].defaultValue || null
      }

      submit (event, onSuccess, onError) {
        event.preventDefault(onSuccess)

        onSuccess = typeof onSuccess === 'function' ? onSuccess : () => {}
        onError = typeof onError === 'function' ? onError : () => {}

        // Get object with fieldName: fieldValue items.
        const data = Object.keys(this.form.fields).reduce(
          (obj, name) => ({
            ...obj,
            [name]: this.getValue(name, this.form.fields)
          }),
          {}
        )

        const coercedData = coercer(data)

        this.form.errors.clear()

        return new Promise((resolve, reject) => {
          if (this.form.rules.length === 0) {
            onSuccess(coercedData, event)
            resolve(coercedData, event)
          } else {
            validate(coercedData, this.form.rules, this.form.messages)
              .then(() => {
                onSuccess(coercedData)
                resolve(coercedData)
              })
              .catch(errors => {
                this.form.errors.replace(errors)

                onError(errors)
                reject({errors, data: coercedData}) // eslint-disable-line
              })
          }
        })
      }

      render () {
        return React.createElement(observer(ComposedComponent), {
          ...this.props,
          form: {
            fields: this.form.fields,
            errors: this.form.errors,
            submit: this.submit,
            setValue: this.setValue,
            createField: this.createField.bind(this)
          }
        })
      }
    }

    return observer(Form)
  }
}
