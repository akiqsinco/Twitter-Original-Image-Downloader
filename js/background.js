chrome.contextMenus.create({
    title: chrome.i18n.getMessage('menu_title'),
    contexts: ['image'],
    type: 'normal',
    targetUrlPatterns: ['https://pbs.twimg.com/media/*'],
    onclick: info => {
        const imageUrl = ensureImageUrl(info.srcUrl)
        const origUrl = imageUrl.replace(/(:thumb|:small|:large|:orig)?$/, ':orig')
        const filename = origUrl.match(/([^/]+):orig$/)[1]
        downloadResource(origUrl, filename)
    }
})

const ensureImageUrl = srcUrl => {
    const imageUrl = srcUrl.replace(/\?.*$/, '')
    const format = srcUrl.match(/format=([^&]+)/)
    return format ? `${imageUrl}.${format[1]}` : imageUrl
}

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
