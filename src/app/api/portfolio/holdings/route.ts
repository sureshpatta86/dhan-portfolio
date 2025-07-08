

function GET_DHAN_API_CONFIG() {
  const accessToken = process.env.DHAN_ACCESS_TOKEN || "";
  const baseUrl = process.env.DHAN_BASE_URL || "";

  if (!accessToken) {
    throw new Error("Access token is required");
  }

  if (!baseUrl) {
    throw new Error("Dhan base URL is not configured");
  }

  return {
    accessToken,
    baseUrl,
  };
}

export async function GET(request: Request) {
  try {
    // Get Dhan API configuration
    console.log("inside");
    const { accessToken, baseUrl } = GET_DHAN_API_CONFIG();
    console.log(Object.keys(process.env));
    if (!accessToken) {
      return new Response(
        JSON.stringify({ error: "Access token is required" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (!baseUrl) {
      return new Response(
        JSON.stringify({ error: "Dhan base URL is not configured" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Fetch data from Dhan API

    const options = {
      method: "GET",
      headers: { "access-token": accessToken, Accept: "application/json" },
    };
    const dhanResponse = await fetch(`${baseUrl}/holdings`, options);

    let responseData;
    let status = dhanResponse.status;
    try {
      responseData = await dhanResponse.json();
    } catch {
      responseData = null;
    }

    // If no holdings or empty response, return { data: [] } with 200
    if (!responseData || (Array.isArray(responseData.data) && responseData.data.length === 0)) {
      return new Response(JSON.stringify({ data: [] }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // If Dhan API returns an error object
    if (responseData.error) {
      return new Response(JSON.stringify({ error: responseData.error }), {
        status: status !== 200 ? status : 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Wrap the response in the expected structure
    const wrappedResponse = {
      success: true,
      endpoint: 'holdings',
      data: Array.isArray(responseData) ? responseData : [],
      count: Array.isArray(responseData) ? responseData.length : 0
    };

    return new Response(JSON.stringify(wrappedResponse), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching data from Dhan API:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

// End of file
