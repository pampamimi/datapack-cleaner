const { readdir, stat, readFile, writeFile } = require("fs");

function sendErr(err) {

    console.clear()

    console.log("Error has occured, please contact Varnilla#2065 on Discord. Send this error message below!\n\n" + err.message)

}

function loop(directoryPath) {

    readdir(directoryPath, (err, files) => {

        if (err) sendErr(err)

        files.forEach(fileOrFolder => {

            stat(directoryPath + fileOrFolder, (err, stat) => {
                
                if (err) sendErr(err)

                if (stat.isDirectory()) loop(directoryPath + fileOrFolder + "/")

                else if (fileOrFolder.endsWith(".mcfunction")) {

                    readFile(directoryPath + fileOrFolder, { encoding: 'utf-8' }, (err, content) => {
                        
                        if (err) sendErr(err)

                        if (content.length == 0) return console.log(`Removed 0 lines from ${fileOrFolder} because its empty`)

                        const qualified = []
                        
                        content.split(/\r?\n/).forEach(line => {
                            
                            if(line.startsWith("#") || !line) return
                            
                            qualified.push(line)
                            
                        })

                        writeFile(directoryPath + fileOrFolder, qualified.join("\n"), err => {

                            if (err) sendErr(err)

                        })

                        console.log(`Removed ${content.split(/\r?\n/).length - qualified.length} lines from ${fileOrFolder}`)

                    })
                }
            })
        })
    })
}

loop("./")
