const relativePathForVPSDeployment = ""; // use this to create docker image FOR render and localhost
// const relativePathForVPSDeployment = "/static-files/" // use this to create docker image FOR VPS docker deployment

// const absolutePathForRenderAndLocalhost = "https://www.pupille.org/bilder/filmbilder/" // to delete after migration to VPS and us this "https://www.pupille.org/static-files/bilder/filmbilder/"
// const absolutePathForRenderAndLocalhost = "https://www.pupille.org/" // to delete after migration to VPS and use this "https://www.pupille.org/static-files/"
const absolutePathForRenderAndLocalhost = "https://www.pupille.org/static-files/"

export const staticFilePathFrontend = relativePathForVPSDeployment || absolutePathForRenderAndLocalhost;



// export const staticFilePathFrontend = import.meta.env.VITE_STATIC_FILEPATH_FRONTEND || 'https://www.pupille.org/bilder/filmbilder/';
