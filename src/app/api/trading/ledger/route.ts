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
    console.log("Fetching ledger from Dhan API");
    const { accessToken, baseUrl } = GET_DHAN_API_CONFIG();
    
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

    // Parse query parameters for date range
    const url = new URL(request.url);
    const fromDate = url.searchParams.get('from-date');
    const toDate = url.searchParams.get('to-date');

    if (!fromDate || !toDate) {
      return new Response(
        JSON.stringify({ error: "from-date and to-date parameters are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Fetch data from Dhan API
    const options = {
      method: "GET",
      headers: { 
        "access-token": accessToken, 
        Accept: "application/json",
        "Content-Type": "application/json"
      },
    };
    
    const dhanResponse = await fetch(`${baseUrl}/ledger?from-date=${fromDate}&to-date=${toDate}`, options);

    let responseData;
    let status = dhanResponse.status;
    try {
      responseData = await dhanResponse.json();
    } catch {
      responseData = null;
    }

    // If no ledger data or empty response, return empty array
    if (!responseData || (Array.isArray(responseData) && responseData.length === 0)) {
      return new Response(JSON.stringify({ 
        data: [],
        success: true,
        endpoint: 'ledger',
        count: 0
      }), {
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
      endpoint: 'ledger',
      data: Array.isArray(responseData) ? responseData : [responseData],
      count: Array.isArray(responseData) ? responseData.length : 1
    };

    return new Response(JSON.stringify(wrappedResponse), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching ledger from Dhan API:", error);
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
