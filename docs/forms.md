## Forms

**Usage**

`TODO: Describe how forms work`

**Validation**

```jsx
ContactForm.form = {
  formName: 'ContactForm',
  rules: {
    email: 'required|email',
    name: 'required|min:3',
    gender: 'in:male,female'
  },
  fields: {
    email: {
      placeholder: 'you@email.com'
    },
    name: {
      placeholder: 'Your name...'
    },
    gender: [
      {type: 'radio', checked: false, value: 'male'},
      {type: 'radio', checked: false, value: 'female'}
    ]
  }
}
```

View all [validation rules](https://github.com/eyedea-io/syncano-validate)
