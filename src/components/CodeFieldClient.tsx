"use client";

import { CodeField, useFormFields } from "@payloadcms/ui";
import type {
  CodeFieldClientProps,
  CodeFieldClient as CodeFieldType,
} from "payload";

export const CodeFieldClient = (props: CodeFieldClientProps) => {
  const {
    autoComplete,
    field,
    forceRender,
    path,
    permissions,
    readOnly,
    renderedBlocks,
    schemaPath,
    validate,
  } = props;

  const languageField = useFormFields(([fields]) => fields.language);

  const language =
    (languageField?.value as string) ||
    (languageField?.initialValue as string) ||
    "text";

  const newField: CodeFieldType = {
    ...field,
    type: "code",
    admin: {
      ...field.admin,
      editorOptions: undefined,
      language,
    },
  };

  const key = `${field.name}-${language}`;
  return (
    <CodeField
      autoComplete={autoComplete}
      field={newField}
      forceRender={forceRender}
      key={key}
      path={path}
      permissions={permissions}
      readOnly={readOnly}
      renderedBlocks={renderedBlocks}
      schemaPath={schemaPath}
      validate={validate}
    />
  );
};
