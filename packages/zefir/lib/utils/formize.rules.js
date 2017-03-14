export function isRequired(report, schema, json) { // eslint-disable-line import/prefer-default-export
  const originalPath = report.path

  if (Array.isArray(schema.required)) {
    schema.required.forEach(prop => {
      const hasValue = json[prop]

      if (!hasValue) {
        report.path = [prop] // eslint-disable-line no-param-reassign
        report.addCustomError('IS_REQUIRED', 'Field is required', [prop], null, schema.description)
      }
    })
  }

  report.path = originalPath // eslint-disable-line no-param-reassign
}
