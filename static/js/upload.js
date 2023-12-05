let fileInput = document.getElementById('file');
let resultEle = document.getElementById('result');
fileInput.addEventListener('change', async e => {
    let file = e.target.files[0];
    let result = await uploadImage(file);
    console.log(result);
    if (result.success) {
        resultEle.innerHTML = result.text;
    }
})


const uploadImage = (image) => {
    return new Promise(async (resolve, reject) => {
        try {
            let formData = new FormData();
            formData.append('image', image);
            var request = {
                "url": '/uploadImage',
                "method": "POST",
                "data": formData,
                "processData": false,
                "contentType": false,
            }
            $.ajax(request).done(function (response) {
                resolve(response);
            }).fail(() => {
                resolve({ success: false });
            })
        } catch (err) {
            resolve({ success: false });
        }
    })
}