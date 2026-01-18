import { httpRouter } from "convex/server";
import { getMetadataHttp } from "./metadata";

const http = httpRouter()

http.route({
    path: "/metadata",
    method: "GET",
    handler: getMetadataHttp
})

export default http;