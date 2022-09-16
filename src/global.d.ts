// this keeps vite-style asset imports from raising TS warnings:
declare module "*.png" {
    const value: string;
    export = value;
}