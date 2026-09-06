export const avgDurationTrailer = 12;

// ---------------------------------------------------

// const relativePathForVPSDeployment = ""; // use this to create docker image FOR render or just for testing on localhost
const relativePathForVPSDeployment = "/static-files/" // use this to create docker image FOR VPS docker deployment

const absolutePathForRenderAndLocalhost = "https://www.pupille.org/static-files/"

export const staticFilePathFrontend = relativePathForVPSDeployment || absolutePathForRenderAndLocalhost;