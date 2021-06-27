
// View rendering functions
// --------------------------------------------------------

function renderEditFile(fileName, fileContent) {
    return `
        <form class="edit-file" data-filename="${fileName}" onsubmit="return onSubmitEditForm(this)">
            <p>
                <textarea name="filecontent">${fileContent}</textarea>
            </p>
            <p>
                <button>Save</button>
            </p>
        </form>
    `
}

function renderShowFile(fileName, fileContent) {
    return `
    <div class="show-file" data-filename="${fileName}">
        <div>
            ${markdownParser(fileContent)}
        </div>
        <p>
            <button onclick="return onClickEdit('${fileName}')">Edit</button> or <a href="#" onclick="return onClickCancel()">Cancel</a>
        </p>
    </div>
`
}

function renderLoginForm() {
    return `
        <form class="login" method="post" action=".">
            <h1>What's the secret code, <nobr>Mr. Bond</nobr>?</h1>
            <p>
                <input type="password" name="master_password" placeholder="">
            </p>
            <p>
                <input type="submit" value="Enter">
            </p>
        </form>
    `
}


function fileItem(filename) {
    return `<li class="file-item">
        <a href="#" data-filename="${filename}" onclick="return onClickEditFilename(this)">${filename}</a>
    </li>`
}

function renderList(files) {
    return `
        <div class="list-of-files">
            <ul>
                ${files.map(f => fileItem(f)).join('')}
            </ul>
        </div>
    `
}

function container(innerHtml) {
    return `<div class="container">${innerHtml}</div>`
}


// DOM helper functions
// --------------------------------------------------------

function replaceMarkdownParts(markdown) {
    return markdown
        .replace(/^### (.*$)/gim, '<h3>$1</h3>') // h3 tag
        .replace(/^## (.*$)/gim, '<h2>$1</h2>') // h2 tag
        .replace(/^# (.*$)/gim, '<h1>$1</h1>') // h1 tag
        .replace(/\*\*(.*)\*\*/gim, '<b>$1</b>') // bold text
        .replace(/\*(.*)\*/gim, '<i>$1</i>') // italic text
        .replace(/\n\n/gm, '<br>'); // newline
} 

function markdownParser(text) {
    var parts = []
    text.split(/\<pw\>/).forEach(split => {
        const pwSplits = split.split(/\<\/pw\>/)
        if (pwSplits.length > 1) {
            parts.push('<pw>')
            parts.push(pwSplits[0])
            parts.push('</pw>')
            parts.push(replaceMarkdownParts( pwSplits[1] ))

        } else {
            parts.push(replaceMarkdownParts( split ))
        }
    })
    const toHTML = parts.join('').replace(/\<pw\>(.*)\<\/pw\>/gim, `<input type="text" value="$1">`)

	return toHTML.trim(); // using trim method to remove whitespace
}

// currentNode - Node
// newNodeHTML - String
function replaceNodeWithHTML(currentNode, newNodeHTML) {
    const newNodeParent = document.createElement('div')
    newNodeParent.innerHTML = newNodeHTML
    const parentNode = currentNode.parentNode
    parentNode.replaceChild(newNodeParent.firstChild, currentNode)
}

function changeContentFor(html) {
    replaceNodeWithHTML(document.querySelector('.container'), container(html))
}

// Encryption helper functions
// --------------------------------------------------------

function decrypt(encryptedBlob, password) {
    return CryptoJS.AES.decrypt(encryptedBlob, password).toString(CryptoJS.enc.Utf8);
}

function encrypt(plaintext, password) {
    return CryptoJS.AES.encrypt(plaintext, password).toString();
}

// Editing files
// --------------------------------------------------------

function onClickEditFilename(element) {
    getFileContent(element.dataset.filename)
        .then((data) => {
            const decrypted = decrypt(data, window.secretPassphrase);
            changeContentFor(renderShowFile(element.dataset.filename, decrypted))
        })
    return false
}

function onSubmitEditForm(formElement) {
    const textarea = formElement.querySelector('textarea')
    const fileName = formElement.dataset.filename
    const encrypted = encrypt(textarea.value, window.secretPassphrase)
    updateContentFor(fileName, encrypted)
        .then(newData => {
            showFile(fileName)
        })
    return false
}

function showFile(fileName) {
    console.log('show file')
    history.pushState({action: 'show', param: fileName}, `'${fileName}' passwords | PWMGR`, `/show/${fileName}`)
    getFileContent(fileName)
        .then((data) => {
            const decrypted = decrypt(data, window.secretPassphrase);
            changeContentFor(renderShowFile(fileName, decrypted))
        })
}

function onClickEdit(fileName) {
    getFileContent(fileName)
        .then((data) => {
            const decrypted = decrypt(data, window.secretPassphrase);
            changeContentFor(renderEditFile(fileName, decrypted))
        })
}

function onClickCancel() {
    showIndex()
    return false;
}

function updateContentFor(filename, encryptedData) {
    return new Promise(resolve => {
        fetch('/update', {
            method: "post",
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            //make sure to serialize your JSON body
            body: JSON.stringify({
              filename: filename,
              encrypteddata: encryptedData
            })
          }).then(response => {
            return response.json()
          }).then(data => {
              resolve(data)
          })
    })
}

// Returns a Promise, with the data as an argument
function getFileContent(filename) {
    return new Promise(resolve => {
        fetch(`/show/${filename}`, {
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            resolve(data.file_content)
        })
    })
}

window.addEventListener('popstate', (event) => {
    console.log("location: " + document.location + ", state: " + JSON.stringify(event.state));
    routeTo(event.state)
});

// Initialize the app
// --------------------------------------------------------

function showIndex() {
    fetch('/list')
    .then((response) => {
        return response.json()
    })
    .then(data => {
        const files = data.map((d)=> {
            // Get last element of path:
            const separated = d.split('/')
            const fileName = separated[separated.length - 1]
            // remove extension:
            const fileNameParts = fileName.split('.')
            return fileNameParts[0]
        })
        changeContentFor(renderList(files))
    })
}



function routeTo(stateObject) {
    if (stateObject.action == 'show') {
        showFile(stateObject.param)
    } else if (stateObject.action == 'index') {
        showIndex()
    }
}