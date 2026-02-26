import hbs from "handlebars";
import fs from "fs";
import path from "path";

export const renderTemplate = (templateName: string, data: any): string => {
  const templatePath = path.join(__dirname, "templates", `${templateName}.hbs`);
  const templateSource = fs.readFileSync(templatePath, "utf8");
  const template = hbs.compile(templateSource);
  return template(data);
};