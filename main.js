window.secretPassphrase = 'twtwt'

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
    // try {
        return CryptoJS.AES.decrypt(encryptedBlob, password).toString(CryptoJS.enc.Utf8);
    // } catch (e) {
        // return '';
    // }
    
}

function encrypt(plaintext, password) {
    return CryptoJS.AES.encrypt(plaintext, password).toString();
}

// Editing files
// --------------------------------------------------------

function onClickEditFilename(element) {
    console.log('onClick', element, element.dataset.filename)
    getFileContent(element.dataset.filename)
        .then((data) => {
            console.log('data', data)
            console.log('gonna decrypt:', data, 'with:', window.secretPassphrase)

            const decrypted = decrypt(data, window.secretPassphrase);
            console.log('decrypted:', decrypted)
            changeContentFor(renderEditFile(element.dataset.filename, decrypted))
        })
    return false
}

function onSubmitEditForm(formElement) {
    const textarea = formElement.querySelector('textarea')
    console.log('on submit', textarea, 'value', textarea.value, 'innerHTML', textarea.innerHTML)
    const fileName = formElement.dataset.filename
    console.log('gonna encrypt:', textarea.value, 'with:', window.secretPassphrase)
    const encrypted = encrypt(textarea.value, window.secretPassphrase)
    console.log('encrypted result is:', encrypted)
    updateContentFor(fileName, encrypted)
    return false
}


function updateContentFor(filename, encryptedData) {
    fetch('/ajax.php?action=update', {
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
      })
    //   .then( (response) => { 
    //      //do something awesome that makes the world a better place
    //      console.log('response', response.json() )
    //   });
}

// Returns a Promise, with the data as an argument
function getFileContent(filename) {
    return new Promise(resolve => {
        fetch(`/ajax.php?action=get&filename=${filename}`)
        .then(response => response.json())
        .then(data => {
            console.log('data received', data, decrypt(data.file_content, window.secretPassphrase))
            resolve(data.file_content)
        })
    })
}


// Initialize the app
// --------------------------------------------------------
fetch('/ajax.php?action=list')
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
        console.log('files', files)
        document.querySelector('body').insertAdjacentHTML('beforeend', container(renderList(files)))
    })
