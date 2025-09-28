const relativePathForVPSDeployment = ""; // use this to create docker image for render and localhost
// const relativePathForVPSDeployment = "/static-files/bilder/filmbilder/" // use this to create docker image for VPS docker deployment

const absolutePathForRenderAndLocalhost = "https://www.pupille.org/bilder/filmbilder/" // to delete after migration to VPS and us this "https://www.pupille.org/static-files/bilder/filmbilder/"
export const staticFilePathFrontend = relativePathForVPSDeployment || absolutePathForRenderAndLocalhost;



// export const staticFilePathFrontend = import.meta.env.VITE_STATIC_FILEPATH_FRONTEND || 'https://www.pupille.org/bilder/filmbilder/';
