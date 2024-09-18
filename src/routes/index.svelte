<script>
    import { Router, Route } from 'svelte-routing';
    import Home from '../components/Home.svelte';
    import VideoPage from '../components/VideoPage.svelte';
    import Upload from '../components/Upload.svelte';
    import VideoTesting from '../components/VideoTesting.svelte';
    export let url = '';
</script>

<Router {url}>
    <div>
        <Route path="scroll" component={VideoPage} />
        <Route path="upload" component={Upload} />
        <Route path="/" component={Home} />
        <Route path="video" component={VideoTesting} />
    </div>
</Router>