package org.pupille.backend;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;

import java.io.IOException;

// This Spring Boot configuration class serves static files and handles SPA client-side routing by falling back to index.html (precisely /static/index.html) for unknown routes.
// Setup is for production deployment where your Spring Boot server hosts both your API and your frontend application (frontend code is in java/resource/static of backend folder) in a single JAR file!
// btw: What is index.html in an SPA? → index.html is the single entry point for your entire React application. It's literally the "single page" in "Single Page Application."
//                                    → return index.html IS the SPA fallback, this allows React Router to handle client-side routing!


//-------------------------------------
// !!! for SOLELY manual testing this Spring configuration always use http://localhost:8080 !!!
// take note of the following when testing from frontend port (to prepare for production):

//██ ███████ ███████ ██    ██ ███████   ██     ██ ██   ██ ███████ ███    ██   ████████ ███████ ███████ ████████ ██ ███    ██  ██████
//██ ██      ██      ██    ██ ██        ██     ██ ██   ██ ██      ████   ██      ██    ██      ██         ██    ██ ████   ██ ██
//██ ███████ ███████ ██    ██ █████     ██  █  ██ ███████ █████   ██ ██  ██      ██    █████   ███████    ██    ██ ██ ██  ██ ██   ███
//██      ██      ██ ██    ██ ██        ██ ███ ██ ██   ██ ██      ██  ██ ██      ██    ██           ██    ██    ██ ██  ██ ██ ██    ██
//██ ███████ ███████  ██████  ███████    ███ ███  ██   ██ ███████ ██   ████      ██    ███████ ███████    ██    ██ ██   ████  ██████

// development vs production mismatch
// * dist/assets/ folder contains built/production assets of the frontend (e.g. index.html, corresponding css and js in the /assets subfolder)
// * running 'npm run dev' or 'vite dev' is development mode
// * in development mode, Vite doesn't use the dist/ folder - it serves assets dynamically from memory (with hot module replacement (HMR) and fast refresh)! // In dev mode, Vite uses the index.html file in your root directory as the entry point. The index.html in root references the development build (not production) assets: <script type="module" src="/src/main.jsx"></script>
// * index.html (specified here in the return statements of the java code below) references build/production assets (like index-Dojkaee9.js)
//  => these assets are fetched...
//          * from dist/assets/ when running vite preview mode under port 4173 or
//          * via /asset vite proxy from the Spring backend when runnung vite dev mode under 5173 i.e. with the /assets proxy in place, those asset requests get properly routed to http://localhost:8080 they exist

// when manual test in vite preview mode under 4173:
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// =>   run in production preview mode with;
//          npm run build
//          npm run preview
//      then test http://localhost:4173/static-files/missing_file.jpg (note the different port - usually 4173 for preview)
// =>   since this is NOT dev mode, vite.config.ts is NOT used, hence CORS issues occur
//      to avoid that, create public class WebConfig to define CORS rules (for your Spring Boot application) for vite's preview mode port 4173: allowedOrigins("http://localhost:4173")
//      test the stuff in vite preview mode under port 4173


// when manual test in vite dev mode under 5173:
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// index.html is NOT fetched from dist/ folder (this folder isn't used at all in dev mode) but from index.html in root folder (root = this is where package.json lies)
// => to have all static images available: make sure that all the vite react build files from dist/ folder are copied in main/java/resources/static (this here is the spring backend!)
//    to avoid CORS issues: don't forget handling CORS in vite.config.ts (only for vite dev mode) or WebConfig class
// => !!! this setting should work; sometimes TURN OFF/ON if IntelliJ helps !!!
//    !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

//-------------------------------------

@Configuration
public class SPAConfiguration implements WebMvcConfigurer {

    // syntax means: if the environment variable static.files.path.for.dockercontainer is set, use its value.
    //               otherwise, use the default value /app/external-static-container/static-files/.
    @Value("${static.files.path.for.dockercontainer:/app/external-static-container/static-files/}")
    private String staticFilesPathForDockercontainer;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {

        // -- 0. Explicitly handle the directory path /static-files and redirect it to the root of your SPA ---
        // This ensures that the request gets picked up by your main SPA client side router (i.e. /static/index.html).
        // !!!!!!!!!!!!!!
        // !!! ATTENTION: "/static-files" and "/static-files/" are (somehow) NOT caught by ANY of the subsequent handlers !!!
        // !!!!!!!!!!!!!!
        registry.addResourceHandler("/static-files", "/static-files/")
                .addResourceLocations("classpath:/static/") // i.e. inside JAR
                .resourceChain(true)
                .addResolver(new PathResourceResolver() {
                    @Override
                    protected Resource getResource(String resourcePath, Resource location) throws IOException {
                        //System.out.println("=== 0th HANDLER RESOLVER (explicit) CALLED ===");
                        //System.out.println("    => 0th HANDLER: index.html will be served");
                        return location.createRelative("index.html"); // by using location.createRelative: Find index.html relative to wherever I'm currently looking (c.f. location in addResourceLocations method)
                    }
                });

        // -- 0.5. Specific Handler for the static-files on HARD DISK (for testing purposes); external-static-container acts as a wrapper --
        // This handler maps requests with "/static-files/[anything]/[anyfile]" directly to the "static-files" folder inside your static directory on the HARD DISK.
        // Handles: /static-files/anything/here.jpg
//        registry.addResourceHandler("/static-files/**")
//                .addResourceLocations("file:C:\\Daten\\dcTest\\external-static-container\\static-files\\")
//                .resourceChain(true)
//                .addResolver(new PathResourceResolver() {
//                    @Override
//                    protected Resource getResource(String resourcePath, Resource location) throws IOException {
//                        //System.out.println("=== 'HALF' HANDLER RESOLVER (/static-files/[anything]/[anyfile]; hard disk) CALLED ===");
//                        //System.out.println("    resourcePath: " + resourcePath);
//                        //System.out.println("    location: " + location);
//
//                        Resource requestedResource = location.createRelative(resourcePath);
//                        if (requestedResource.exists() && requestedResource.isReadable()) {
//                            //System.out.println("    => 'HALF' HANDLER: returning requested resource");
//                            return requestedResource;
//                        } else {
//                            // Fall back to index.html in /static if the file does not exist
//                            //System.out.println("    => 'HALF' HANDLER: falling back to ClassPathResource index.html");
//                            return new ClassPathResource("/static/index.html"); // by using ClassPathResource: Always get index.html from /static/, ignore where I'm currently looking
//                        }
//                    }
//                });

        // -- 1. Specific Handler for the static-files in docker container, which is bind mounted; external-static-container acts as a wrapper --
        // This handler maps requests with "/static-files/[anything]/[anyfile]" directly to the "static-files" folder inside your static directory in a Docker Container.
        // Handles: /static-files/anything/here.jpg
        //        GET /static-files/photo.jpg    → /app/external-static-container/static-files/photo.jpg
        //        GET /static-files/missing.png  → /static/index.html (fallback)
        //        GET /static-files/docs/file.pdf → /app/external-static-container/static-files/docs/file.pdf
        registry.addResourceHandler("/static-files/**") // URL: /static-files is NO MATCH; because it requires something after /static-files/
                // .addResourceLocations("file:/app/external-static-container/static-files/") // hard coded
                .addResourceLocations("file:" + staticFilesPathForDockercontainer)
                .resourceChain(true)
                .addResolver(new PathResourceResolver() {
                    @Override
                    protected Resource getResource(String resourcePath, Resource location) throws IOException {
                        Resource requestedResource = location.createRelative(resourcePath);
                        if (requestedResource.exists() && requestedResource.isReadable()) {
                            return requestedResource;
                        } else {
                            // Fall back to index.html in /static if the file does not exist
                            return new ClassPathResource("/static/index.html"); // by using ClassPathResource: Always get index.html from /static/, ignore where I'm currently looking
                        }
                    }
                });

        // -- 2. The main handler for your SPA, which should be placed AFTER specific handlers --
        // Enables SPA routing - Any unknown route falls back to index.html, allowing client-side routing to work
        // Handles: Everything else (/, /about, /users/123, /app.js, etc.)
        // Serves from: Multiple locations (searches in order)
        // Logic: Serve real files when they exist (in the specified locations), otherwise serve index.html for SPA routing
        //        GET /                    → /static/index.html (SPA)
        //        GET /app.js              → /static/app.js (actual JS file)
        //        GET /favicon.ico         → /static/favicon.ico (actual icon)
        //        GET /missing-file.css    → File doesn't exist → returns /static/index.html (fallback)
        //        GET /kinobesuch          → File doesn't exist → returns /static/index.html (THIS is the SPA fallback, This allows React Router to handle client-side routing!)
        //        GET /some/deep/route     → File doesn't exist → returns /static/index.html (THIS is the SPA fallback, This allows React Router to handle client-side routing!)
        registry.addResourceHandler("/**")
                .addResourceLocations(      // Spring will search for static files in this exact order
                        "classpath:/static/"
                        //"classpath:/public/",
                        //"classpath:/resources/",
                        //"classpath:/META-INF/resources/"
                )
                .resourceChain(true)
                .addResolver(new PathResourceResolver() {
                    @Override
                    protected Resource getResource(String resourcePath, Resource location) throws IOException {

//                                    // Don't handle /assets/ requests - let them 404
//                                    if (resourcePath.startsWith("assets/")) {
//                                        return null;
//                                    }


                        //System.out.println("=== LAST RESOLVER CALLED ===");
                        //System.out.println("    resourcePath: " + resourcePath);
                        //System.out.println("    location: " + location);
                        Resource requestedResource = location.createRelative(resourcePath);
                        //System.out.println("    requestedResource: " + requestedResource);
                        //System.out.println("    requestedResource.exists(): " + requestedResource.exists());
                        //System.out.println("    requestedResource.isReadable(): " + requestedResource.isReadable());

                        if (requestedResource.exists() && requestedResource.isReadable()) {
                            //System.out.println("    => LAST HANDLER: returning requested resource");
                            return requestedResource;
                        } else {
                            // If the resource doesn't exist, return index.html for SPA routing
                            Resource fallback = location.createRelative("index.html");

                            //System.out.println("    fallback: " + fallback);
                            //System.out.println("    fallback.exists(): " + fallback.exists());
                            //System.out.println("    fallback.isReadable(): " + fallback.isReadable());
                            //System.out.println("    => LAST HANDLER: falling back to location.createRelative index.html (here in /static/index.html)");
                            return fallback; // Find index.html relative to wherever I'm currently looking (c.f. locations in addResourceLocations method)
                            // The change to a different location (specified in addResourceLocations) happens when the originally requested file is not found, AND the fallback index.html is also not found in the current location.
                        }
                    }
                });


//                        registry.addResourceHandler("/assets/**")
//                                .addResourceLocations("classpath:/static/assets/");

        //    Production Flow:
        //    User visits: https://myapp.com/dashboard
        //    Spring checks: No file at /static/dashboard
        //    Spring returns: /static/index.html
        //    React Router: Takes over and shows dashboard component
        //    User requests: https://myapp.com/static-files/avatar.jpg
        //    Spring serves: /app/external-static-container/static-files/avatar.jpg

        //    Request Flow Examples
        //    URL                         Handler Used    Result
        //    /                           Handler 3       index.html (SPA)
        //    /kinobesuch                 Handler 3       index.html (SPA)
        //    /app.js                     Handler 3       app.js (real file)
        //    /static-files               Handler 1       index.html
        //    /static-files/photo.jpg     Handler 2       photo.jpg ✅
        //    /static-files/missing.jpg   Handler 2       index.html (fallback)

    }

}
