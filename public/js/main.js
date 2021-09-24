
tinymce.init({
    selector: 'textarea',
    plugins: 'advlist autolink lists link image charmap print preview hr anchor pagebreak',
    toolbar_mode: 'floating',
    images_upload_url: '/image-upload',

/* we override default upload handler to simulate successful upload*/
    images_upload_handler: uploadImage,

    setup: (ed)=>{
        ed.on('keyDown',deleteImage);
    }
    
});

// Image upload Handler
function uploadImage(blobInfo, success, failure, progress){
    const formData = new FormData();
    console.log(blobInfo.filename());
    formData.append('image', blobInfo.blob());

    fetch('/image-upload', {
    method: 'POST',
    body: formData
    })
    .then(response => response.json())
    .then(result => {
    console.log('Success:', result);
    success(result.location);
    })
    .catch(error => {
    console.error('Error:', error);
    failure('cannot upload');
    });
}


function deleteImage (e){
    const formData = new FormData();
    if ((e.keyCode == 8 || e.keyCode == 46) && tinymce.activeEditor.selection) { // delete & backspace keys

        var selectedNode = tinymce.activeEditor.selection.getNode(); // get the selected node (element) in the editor

        if (selectedNode && selectedNode.nodeName == 'IMG') {
            // console.log(selectedNode.src); // A callback that will let me invoke the deletion of the image on the server if appropriate for the image source.
            const data = {"pathFile":selectedNode.src};
            fetch('/image-delete',{
                method:'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                body:JSON.stringify(data)
            }).then(response=>response.json())
            .then(result=>{
                console.log('success delete',result);
            })
            .catch(error=>{
                console.error('Error: ',error);
            });
        }
    }
}


