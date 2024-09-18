<script>
    let file;
    let title = '';
    let description = '';
    let descriptionSourceLink = '';
    let descriptionSource = '';
    let videoLink = '';
    let videoSource = '';

    function handleFileUpload(event) {
        file = event.target.files[0];
    }

    async function uploadFile(event) {
        event.preventDefault();

        if (!file) {
            alert('No file selected');
            return;
        }

        const formData = new FormData();
        formData.append('video', file);
        formData.append('title', title);
        formData.append('description', description);
        formData.append('descriptionSourceLink', descriptionSourceLink);
        formData.append('descriptionSource', descriptionSource);

        // Log the form data
        console.log('Title being sent:', title);
        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }

        try {
            const response = await fetch("http://localhost:3000/uploadVideo", {
                method: "POST",
                body: formData,
            });

            const result = await response.json();

            if (response.ok) {
                alert(result.message);
                // Instead of redirecting, you can update the UI or navigate using Svelte routing
                // For example, you can use the `navigate` function from svelte-routing
                // navigate('/');
            } else {
                alert(`Failed to upload file: ${result.message}`);
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            alert("Error uploading file.");
        }
    }
</script>

<div class="container">
    <h1>Upload</h1>
    <form on:submit={uploadFile} class="upload-form" enctype="multipart/form-data">
        <input id="title" type="text" name="title" bind:value={title} placeholder="Title" />
        <textarea id="description" name="description" bind:value={description} placeholder="Description"></textarea>
        <input id="descriptionSourceLink" type="text" name="descriptionSourceLink" bind:value={descriptionSourceLink} placeholder="Description Source Link" />
        <input id="descriptionSource" type="text" name="descriptionSource" bind:value={descriptionSource} placeholder="Description Source" />
        <input id="video" type="file" name="video" on:change={handleFileUpload} />
        <button type="submit">Upload</button>
        <!-- need to handle redirecting to new upload page -->
    </form>
</div>

<style>
    .container {
        display: flex;
        flex-direction: column;
        align-items: center;

    }

    .upload-form {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 50%;
    }
</style>