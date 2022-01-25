export class StatusCode {
  private static allowedOrigins = [
    "http://localhost:4200",
    "https://dev-e30hms.web.app",
    "https://dev-paerelet.web.app",
    "https://paerelet.web.app",
    "https://paerelet-en.web.app"
  ];

  private static validateHeader(origin) {
    let headers = {};

    if (this.allowedOrigins.includes(origin)) {
      headers = {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Headers": "Identity-Id"
      };
    }

    return headers;
  }

  public static Error400(origin: string, message = "Bad request") {
    return {
      statusCode: 400,
      headers: this.validateHeader(origin),
      body: JSON.stringify({
        message: message
      })
    };
  }

  public static Error404(origin: string, message = "Not found") {
    return {
      statusCode: 404,
      headers: this.validateHeader(origin),
      body: JSON.stringify({
        message: message
      })
    };
  }

  public static Error500(origin: string, message = "Internal Server Error") {
    return {
      statusCode: 500,
      headers: this.validateHeader(origin),
      body: JSON.stringify({
        message: message
      })
    };
  }

  public static Success201(item, origin: string) {
    return {
      statusCode: 201,
      headers: this.validateHeader(origin),
      body: JSON.stringify(item)
    };
  }

  public static Success200(item, origin: string) {
    return {
      statusCode: 200,
      headers: this.validateHeader(origin),
      body: JSON.stringify(item)
    };
  }

  public static Success204(origin: string, message = "Item was deleted") {
    return {
      statusCode: 204,
      headers: this.validateHeader(origin),
      body: JSON.stringify({
        message: message
      })
    };
  }
}
