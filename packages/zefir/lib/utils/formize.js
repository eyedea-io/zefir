import React, {Component, PropTypes} from 'react'
import coercer from 'coercer'
import ZSchema from 'z-schema'
import {observer} from 'mobx-react'
import {extendObservable, observable} from 'mobx'
import * as FormRules from './formize.rules'

export default function formize ({formName, fields, schema = {}, permament = true}) {
  const validator = new ZSchema({
    customValidator: (Report, Schema, Values) => {
      Object.keys(FormRules).forEach(rule => FormRules[rule](Report, Schema, Values))
    }
  })

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
          errors: {},
          schema
        }

        switch (typeof fields) {
          case 'function':
            form.fields = fields({...props, ...context})
            break
          case 'object':
            form.fields = fields
            break
          default:
            throw new Error('Property "fields" is required and must be function or object')
        }

        form.fields = Object
          .keys(form.fields)
          .reduce((obj, name) => ({
            ...obj,
            [name]: {
              name,
              value: '',
              onChange: e => this.setValue(e),
              ...form.fields[name]
            }
          }), {})

        if (!context.stores.forms.get(formName) || !permament) {
          context.stores.forms.set(formName, form)
        }

        this.form = context.stores.forms.get(formName)
        this.submit = this.submit.bind(this)
        this.setValue = this.setValue.bind(this)
      }

      setValue (event, val) {
        const isObject = typeof event === 'object'
        const isCheckbox = event.target.type === 'checkbox'

        const name = isObject ? event.target.name : event
        const value = isObject ? event.target.value : val
        const checked = isObject && isCheckbox ? coercer(event.target.checked) : undefined

        this.form.fields[name].value = coercer(value)

        if (checked !== undefined) {
          this.form.fields[name].checked = checked
        }
      }

      submit (event, cb) {
        event.preventDefault(cb)

        // Get object with fieldName: fieldValue items.
        const data = Object
          .keys(this.form.fields)
          .reduce((obj, name) => ({
            ...obj,
            [name]:
              Object.prototype.isPrototypeOf.call(this.form.fields[name], 'checked') ? this.form.fields[name].checked
                : Object.prototype.isPrototypeOf.call(this.form.fields[name], 'value') ? this.form.fields[name].value
                : this.form.fields[name].defaultValue
          }), {})

        const coercedData = coercer(data)

        if (this.form.schema.length === 0) {
          cb(coercedData, event)
        } else {
          const isValid = validator.validate(data, this.form.schema)
          const errors = validator.getLastErrors()

          this.form.errors = {}

          if (errors) {
            errors.forEach(({path, message}) => {
              this.form.errors[path.substr(2)] = message
            })
          }

          if (isValid) {
            cb(coercedData, event)
          }
        }
      }

      render () {
        return React.createElement(observer(ComposedComponent), {
          ...this.props,
          formize: {
            fields: this.form.fields,
            errors: this.form.errors,
            submit: this.submit,
            setValue: this.setValue
          }
        })
      }
    }

    return observer(Form)
  }
}
