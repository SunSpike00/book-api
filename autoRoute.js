const fs = require("fs");
const path = require("path");


module.exports = function (root, app) {
  // /api
  const dir = fs.readdirSync(path.join(__dirname, root), {
    withFileTypes: true,
  });
	//console.log('dir',dir);

  dir.forEach((p) => {
		//console.log(`p.name : .${root}/${p.name}`);
    if (p.isDirectory()) {
      // /api
      if (p.name != "_controller") {
        arguments.callee(`${root}/${p.name}`, app);
      }
    } else {
      let moduleName = '/'+ p.name.replace(/\.js/g, "");
      if(moduleName == '/index'){
        moduleName="";
      }
			//console.log(`p.name : ${root}${moduleName}`,`.${root}/${p.name}`);
      app.use(`${root}${moduleName}`, require(`.${root}/${p.name}`));
    }
  });
};