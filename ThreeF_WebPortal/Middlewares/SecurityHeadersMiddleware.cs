using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Primitives;
using System;
using System.Threading.Tasks;

namespace ThreeF_WebPortal.Middlewares
{
    public class SecurityHeadersMiddleware
    {
        private readonly RequestDelegate _next;

        public SecurityHeadersMiddleware(RequestDelegate next)
        {
            _next = next;
        }
        public Task Invoke(HttpContext context)
        {
            try
            {
                // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy
                // TODO Change the value depending of your needs
                context.Response.Headers.Add("referrer-policy", new StringValues("strict-origin-when-cross-origin"));

                // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options
                context.Response.Headers.Add("x-content-type-options", new StringValues("nosniff"));

                // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options
                context.Response.Headers.Add("x-frame-options", new StringValues("DENY"));

                // https://security.stackexchange.com/questions/166024/does-the-x-permitted-cross-domain-policies-header-have-any-benefit-for-my-websit
                context.Response.Headers.Add("X-Permitted-Cross-Domain-Policies", new StringValues("none"));

                // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-XSS-Protection
                context.Response.Headers.Add("x-xss-protection", new StringValues("1; mode=block"));

                //Compress gzip file static
                if (context.Response.ContentType == "text/css" || context.Response.ContentType == "text/js" || context.Response.ContentType == "image/*")
                {
                    context.Response.Headers.Add("Accept-Encoding", new StringValues("true"));
                    context.Response.Headers.Add("Content-Encoding", new StringValues("gzip"));
                }

                //Remove x-powered-by
                context.Response.Headers.Remove("Server");
                context.Response.Headers.Remove("X-Powered-By");
                context.Response.Headers.Remove("X-SourceFiles");

                // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Expect-CT
                // You can use https://report-uri.com/ to get notified when a misissued certificate is detected
                //context.Response.Headers.Add("Expect-CT", new StringValues("max-age=0, enforce, report-uri=\"https://46360776410f16df4cecb243c3ab0ed8.report-uri.com/r/d/ct/enforce\""));

                // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Feature-Policy
                // https://github.com/w3c/webappsec-feature-policy/blob/master/features.md
                // https://developers.google.com/web/updates/2018/06/feature-policy
                // TODO change the value of each rule and check the documentation to see if new features are available
                //context.Response.Headers.Add("Feature-Policy", new StringValues(
                //    "accelerometer 'none';" +
                //    "ambient-light-sensor 'none';" +
                //    "autoplay 'none';" +
                //    "battery 'none';" +
                //    "camera 'none';" +
                //    "display-capture 'none';" +
                //    "document-domain 'none';" +
                //    "encrypted-media 'none';" +
                //    "execution-while-not-rendered 'none';" +
                //    "execution-while-out-of-viewport 'none';" +
                //    "gyroscope 'none';" +
                //    "magnetometer 'none';" +
                //    "microphone 'none';" +
                //    "midi 'none';" +
                //    "navigation-override 'none';" +
                //    "payment 'none';" +
                //    "picture-in-picture 'none';" +
                //    "publickey-credentials-get 'none';" +
                //    "sync-xhr 'none';" +
                //    "usb 'none';" +
                //    "wake-lock 'none';" +
                //    "xr-spatial-tracking 'none';"
                //    ));

                // https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
                // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy
                // TODO change the value of each rule and check the documentation to see if new rules are available
                //context.Response.Headers.Add("Content-Security-Policy", new StringValues(
                //    "base-uri 'none';" +
                //    "block-all-mixed-content;" +
                //    "child-src 'none';" +
                //    "connect-src 'none';" +
                //    "default-src 'none';" +
                //    "font-src 'none';" +
                //    "form-action 'none';" +
                //    "frame-ancestors 'none';" +
                //    "frame-src 'none';" +
                //    "img-src 'none';" +
                //    "manifest-src 'none';" +
                //    "media-src 'none';" +
                //    "object-src 'none';" +
                //    "sandbox;" +
                //    "script-src 'none';" +
                //    "script-src-attr 'none';" +
                //    "script-src-elem 'none';" +
                //    "style-src 'none';" +
                //    "style-src-attr 'none';" +
                //    "style-src-elem 'none';" +
                //    "upgrade-insecure-requests;" +
                //    "worker-src 'none';"
                //    ));
            }
            catch (Exception)
            {
            }
            return _next(context);
        }
    }
}
