import fs from "fs";
import path from "path";

const PRISMA_FILE_PATH = path.join(__dirname, "schema.prisma");

function snakeToCamel(str: string) {
  return str.replace(/([-_]\w)/g, (g) => g[1].toUpperCase());
}
function snakeToPascal(str: string) {
  const camelCase = snakeToCamel(str);
  return `${camelCase[0].toUpperCase()}${camelCase.substr(1)}`;
}

const PRISMA_PRIMITIVES = ["String", "Boolean", "Int", "Float", "DateTime"];

function isPrimitiveType(typeName: string) {
  return PRISMA_PRIMITIVES.includes(typeName);
}

function fixFieldsArrayString(fields: string) {
  return fields
    .split(", ")
    .map((field) => snakeToCamel(field))
    .join(", ");
}

async function fixPrismaFile() {
  const text = fs.readFileSync(path.join(PRISMA_FILE_PATH), "utf8");

  const textAsArray = text.split("\n");

  const fixedText: string[] = [];
  let currentModelName: string | null = null;
  let hasAddedModelMap = false;

  for (const line of textAsArray) {
    // Are we at the start of a model definition
    const modelMatch = line.match(/^model (\w+) {$/);
    if (modelMatch) {
      currentModelName = modelMatch[1];
      hasAddedModelMap = false;
      const pascalModelName = snakeToPascal(currentModelName);
      fixedText.push(`model ${pascalModelName} {`);
      continue;
    }

    // We don't need to change anything if we aren't in a model body
    if (!currentModelName) {
      fixedText.push(line);
      continue;
    }

    // Add the @@map to the table name for the model
    if (!hasAddedModelMap && (line.match(/\s+@@/) || line === "}")) {
      if (line === "}") {
        fixedText.push("");
      }
      fixedText.push(`  @@map("${currentModelName}")`);
      hasAddedModelMap = true;
    }

    // Renames field and applies a @map to the field name if it is snake case
    // Adds an s to the field name if the type is an array relation
    const fieldMatch = line.match(/\s\s(\w+)\s+(\w+)(\[\])?/);
    let fixedLine = line;
    if (fieldMatch) {
      const [, currentFieldName, currentFieldType, isArrayType] = fieldMatch;

      let fixedFieldName = snakeToCamel(currentFieldName);
      if (isArrayType && !fixedFieldName.endsWith("s")) {
        fixedFieldName = `${fixedFieldName}s`;
      }

      fixedLine = fixedLine.replace(currentFieldName, fixedFieldName);

      // Add map if we needed to convert the field name and the field is not a relational type
      // If it's relational, the field type will be a non-primitive, hence the isPrimitiveType check
      if (currentFieldName.includes("_") && isPrimitiveType(currentFieldType)) {
        fixedLine = `${fixedLine} @map("${currentFieldName}")`;
      }
    }

    // Capitalizes model names in field types
    const fieldTypeMatch = fixedLine.match(/\s\s\w+\s+(\w+)/);
    if (fieldTypeMatch) {
      const currentFieldType = fieldTypeMatch[1];
      const fieldTypeIndex = fieldTypeMatch[0].lastIndexOf(currentFieldType);
      const fixedFieldType = snakeToPascal(currentFieldType);
      const startOfLine = fixedLine.substr(0, fieldTypeIndex);
      const restOfLine = fixedLine.substr(
        fieldTypeIndex + currentFieldType.length
      );
      fixedLine = `${startOfLine}${fixedFieldType}${restOfLine}`;
    }

    // Changes `fields: [relation_id]` in @relation to camel case
    const relationFieldsMatch = fixedLine.match(/fields:\s\[([\w,\s]+)\]/);
    if (relationFieldsMatch) {
      const fields = relationFieldsMatch[1];
      fixedLine = fixedLine.replace(fields, fixFieldsArrayString(fields));
    }

    // Changes fields listed in @@index or @@unique to camel case
    const indexUniqueFieldsMatch = fixedLine.match(/@@\w+\(\[([\w,\s]+)\]/);
    if (indexUniqueFieldsMatch) {
      const fields = indexUniqueFieldsMatch[1];
      fixedLine = fixedLine.replace(fields, fixFieldsArrayString(fields));
    }

    fixedText.push(fixedLine);
  }

  fs.writeFileSync(PRISMA_FILE_PATH, fixedText.join("\n"));
}

fixPrismaFile();
