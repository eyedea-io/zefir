export function isRequired (report, schema, json) {
  const originalPath = report.path

  if (Array.isArray(schema.required)) {
    schema.required.forEach(prop => {
      const hasValue = json[prop]

      if (!hasValue) {
        report.path = [prop]
        report.addCustomError('IS_REQUIRED', 'Field is required', [prop], null, schema.description)
      }
    })
  }

  report.path = originalPath
}
