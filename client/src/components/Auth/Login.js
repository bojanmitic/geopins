import React, { useContext } from "react";
import { GraphQLClient } from "graphql-request";
import { GoogleLogin } from "react-google-login";
import { withStyles } from "@material-ui/core/styles";
import Context from "../../context";
import Typography from "@material-ui/core/Typography";
import { ME_QUERY } from "../../graphql/queries";

const onFailure = err => {
  console.error("Error logging in", err);
};

const Login = ({ classes }) => {
  const { dispatch } = useContext(Context);

  const onSuccess = async googleUser => {
    try {
      const idToken = googleUser.getAuthResponse().id_token;
      const client = new GraphQLClient("http://localhost:4000/graphql", {
        headers: { authorization: idToken }
      });
      const { me } = await client.request(ME_QUERY);
      dispatch({
        type: "LOGIN_USER",
        payload: me
      });
      dispatch({
        type: "IS_LOGGED_IN",
        payload: googleUser.isSignedIn()
      });
    } catch (error) {
      onFailure(error);
    }
  };
  return (
    <div className={classes.root}>
      <Typography
        component="h1"
        variant="h3"
        gutterBottom
        noWrap
        style={{ color: "rgb(66,133,244)" }}
      >
        Welcome
      </Typography>
      <GoogleLogin
        clientId="897262511068-lp6nh27lc8hh81feb1g725c5r1c9eb3u.apps.googleusercontent.com"
        onSuccess={onSuccess}
        isSignedIn={true}
        onFailure={onFailure}
        theme="dark"
        buttonText="Login with Google"
      />
    </div>
  );
};

const styles = {
  root: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center"
  }
};

export default withStyles(styles)(Login);
