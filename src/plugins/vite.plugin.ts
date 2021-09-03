import fs from "fs";
import path from "path";
import type { ResolvedConfig, Plugin } from "vite";

// 虚拟模块ID
const MODULE_ID = "virtual:http-request";
// 默认定义文件名
const DECLARATION_FILE = "request.d.ts";

// 服务列表
let generatedServices: service[];
// vite配置项
let viteConfig: ResolvedConfig;

type service = {
  name: string;
  path: string;
};

type Option = {
  root: string;
  alias: string;
  serviceDir: string;
  serviceDeclaration: string;
};

export default (option: Option): Plugin => {
  return {
    name: "vite-plugin-http-request",
    enforce: "pre",
    resolveId(id: string) {
      if (id === MODULE_ID) {
        return MODULE_ID;
      }
    },
    configResolved(config) {
      viteConfig = config;
    },
    load(id: string) {
      if (id !== MODULE_ID) return;

      if (!generatedServices) {
        generatedServices = generateServices(generateServicePaths(option));
      }

      if (generatedServices) {
        generateDeclaration(generatedServices, option.serviceDeclaration);
        return generateCode(generatedServices);
      }
    },
  };
};

/**
 * 生成服务路径
 * @param option
 * @returns
 */
function generateServicePaths(option: Option) {
  const servicePaths: string[] = [];
  const walk = (dir: string) => {
    fs.readdirSync(dir).forEach(function (file) {
      // 修正windows路径符号问题
      const fullpath = path.join(dir, file).replace(/\\/g, "/");
      const stat = fs.statSync(fullpath);

      if (stat.isFile() && fullpath.endsWith(".service.ts")) {
        servicePaths.push(fullpath);
      } else if (stat.isDirectory()) {
        const subdir = path.join(dir, file);
        walk(subdir);
      }
    });
  };

  walk(path.resolve(option.root, option.serviceDir));

  return servicePaths.map((servicePath) =>
    servicePath.replace(option.root.replace(/\\/g, "/"), option.alias)
  );
}

/**
 * 生成服务项
 * @param paths
 * @returns
 */
function generateServices(paths: string[]) {
  return paths.map((service) => {
    const [name] =
      /[^\\]+(?=\.service\.ts$)/.exec(
        path
          .basename(service)
          .replace(/-(\w)/g, ($, $1: string) => $1.toUpperCase())
          .replace(/^\S/, (s) => s.toUpperCase())
      ) || [];

    return {
      name: `${name}Service`,
      path: service,
    };
  });
}

function generateCode(services: service[]) {
  const importCode = generateImportCode(services);
  const serviceCode = generateServiceCode(services);

  return `
${importCode}
${serviceCode}

export function useRequest(
  select
) {
  const service = select(serviceList)
  return new service()
}
  `;
}

/**
 * 生成导入代码
 * @param services
 * @param placeholder
 * @returns
 */
function generateImportCode(
  services: {
    name: string;
    path: string;
  }[],
  placeholder = ""
) {
  return services
    .map(
      (service) =>
        `import { ${service.name} } from '${service.path.replace(
          /\.ts$/g,
          ""
        )}'`
    )
    .join(`\r\n${placeholder}`);
}

/**
 * 生成服务列表
 * @param services
 * @param placeholder
 * @returns
 */
function generateServiceCode(
  services: {
    name: string;
    path: string;
  }[],
  placeholder = ""
) {
  return `const serviceList = {
    ${services.map((service) => service.name).join(`,\r\n${placeholder}`)}
  }`;
}

/**
 * 生成定义文件
 */
function generateDeclaration(services: service[], serviceDeclaration: string) {
  const importCode = generateImportCode(services, "  ");
  const serviceCode = generateServiceCode(services, "    ");

  const declaration = `declare module '${MODULE_ID}' {
  ${importCode}
  ${serviceCode}

  export function useRequest<T>(
    select: (services: typeof serviceList) => { new (): T }
  ): T
}
`;

  fs.writeFileSync(
    path.resolve(viteConfig.root, serviceDeclaration ?? DECLARATION_FILE),
    declaration,
    "utf-8"
  );
}
