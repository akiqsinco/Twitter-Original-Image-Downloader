chrome.contextMenus.create({
    title: chrome.i18n.getMessage('menu_title'),
    contexts: ['image'],
    type: 'normal',
    targetUrlPatterns: ['https://pbs.twimg.com/media/*'],
    onclick: info => {
        const origUrl = info.srcUrl.replace(/:(small|large|thumb)$/, '') + ':orig'
        const filename = origUrl.replace(/:orig$/, '').match('[^/]+$')[0]
        downloadResource(origUrl, filename)
    }
})

const forceDownload = (blob, filename) => {
    const anchor = document.createElement('a')
    anchor.download = filename
    anchor.href = blob
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
}

const downloadResource = (url, filename) => {
    if (!filename) {
        filename = url.split('\\').pop().split('/').pop()
    }

    fetch(url, {
        headers: new Headers({
            'Origin': location.origin
        }),
        mode: 'cors'
    })
        .then(response => response.blob())
        .then(blob => {
            let blobUrl = window.URL.createObjectURL(blob)
            forceDownload(blobUrl, filename)
        })
        .catch(e => console.error(e))
}
