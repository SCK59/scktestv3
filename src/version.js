const fs = require("fs").promises;

/**
 * return version info of the application.
 * @param {Object} req 
 * @param {Object} res 
 */
const getVersionData = async (req, res) => {
    try {
      const commitsha = await fs.readFile("metadata","utf8");
      const version = process.env.npm_package_version;
      const description = process.env.npm_package_description;

      const versionInfo = {
        sha : commitsha,
        version,
        description
      }

      res.send(versionInfo);
    } catch (error) {
      console.log(error.message);
      res.sendStatus(500);
    }
}

module.exports = {
  getVersionData
}
