import hbs from "handlebars";
import fs from "fs";
import path from "path";

// cache object
const templateCache: Record<string, HandlebarsTemplateDelegate> = {};

export const renderTemplate = (templateName: string, data: any): string => {
  try {
    // agar cache me already compiled template hai
    if (!templateCache[templateName]) {
      const templatePath = path.join(
        __dirname,
        "../templates",
        `${templateName}.hbs`
      );

      const templateSource = fs.readFileSync(templatePath, "utf8");

      // compile once
      templateCache[templateName] = hbs.compile(templateSource);
    }

    // render using cached template
    return templateCache[templateName](data);

  } catch (error) {
    console.error("Template rendering error:", error);
    throw new Error("Failed to render email template");
  }
};