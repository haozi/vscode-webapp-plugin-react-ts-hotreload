module.exports = {
  input: 'src/extension.ts', // string | string[] | null. if not set, will find src/index*{.ts,.tsx,.js,.jsx,.es6,.es,.mjs}
  outDir: './out',
  declarationDir: false,
  compilerOptions: [
    {
      format: 'umd',
      extName: '.js',
      target: 'es2018'
    }
  ]
}
