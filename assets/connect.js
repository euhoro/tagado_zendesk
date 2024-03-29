// zendeskConnectionName is a human-friendly name for referencing
// Zendesk OAuth connection stored in ZIS
const zendeskConnectionName = "zendesk";

// zendeskOAuthClientName is used to reference the companion Zendesk OAuth
// client that came with the ZIS integration
const zendeskOAuthClientName = "zendesk";

function startOAuth(integrationKey, subdomain) {
  let data = JSON.stringify({
    name: zendeskConnectionName,
    oauth_client_name: zendeskOAuthClientName,
    oauth_url_subdomain: subdomain,
    origin_oauth_redirect_url: window.location.href,
    permission_scopes: "read write"
  });

  let request = {
    type: "POST",
    url: "/api/services/zis/connections/oauth/start/" + integrationKey,
    contentType: "application/json",
    data: data
  };

  client.request(request).then(
    function(response) {
      //eugen cons.lg("OAuth started successfully");
      authorize(response.redirect_url)
    },
    function(response) {
      //eugen cons.lg("Failed to start OAuth: ", response);
    }
  );
};

function authorize(redirectURL) {
  let authWindow = window.open(redirectURL, '_blank')
  //eugen setT(watchToken, 1500);
  // poll token from the newly opened window
  function watchToken() {
    try {
      let params = new URL(authWindow.location.href).searchParams;
      // Cross-origin access will cause error on the above line
      // Once the oauth is completed, the authWindow's location
      // will be redirected back to the same origin, which in turn
      // allow us to get the verification token
      let verificationToken = params.get('verification_token');
      //eugen cons.lg("Successfully established connection");
      authWindow.close();
    } catch(err) {
      //eugen cons.lg("DOM error is expected during cross domain authorization: " + err);
      //eugen setT(watchToken, 500)
    }
  }
};

// startSlackOAuth initiates a Slack OAuth flow
function startSlackOAuth(integrationKey, subdomain) {
  let data = JSON.stringify({
    name: "slack", // the name the obtained access token
    oauth_client_name: "slack",
    oauth_url_subdomain: subdomain,
    origin_oauth_redirect_url: window.location.href,
    permission_scopes: "chat:write"
  });

  let request = {
    type: "POST",
    url: "/api/services/zis/connections/oauth/start/" + integrationKey,
    contentType: "application/json",
    data: data
  };

  client.request(request).then(
    function(response) {
      //eugen cons.lg("OAuth started successfully");
      authorize(response.redirect_url)
    },
    function(response) {
      //eugen cons.lg("Failed to start OAuth: ", response);
    }
  );
};

