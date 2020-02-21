import Document, { Head, Main, NextScript } from "next/document";
// Import styled components ServerStyleSheet
import styled, { ServerStyleSheet } from "styled-components";
import "./styles.scss";

export default class MyDocument extends Document {
  static getInitialProps({ renderPage }) {
    // Step 1: Create an instance of ServerStyleSheet
    const sheet = new ServerStyleSheet();

    // Step 2: Retrieve styles from components in the page
    const page = renderPage(App => props =>
      sheet.collectStyles(<App {...props} />)
    );

    // Step 3: Extract the styles as <style> tags
    const styleTags = sheet.getStyleElement();

    // Step 4: Pass styleTags as a prop
    return { ...page, styleTags };
  }

  render() {
    return (
      <html>
        <Head>
          {/* Step 5: Output the styles in the head  */}

          {
            //@ts-ignore
            this.props.styleTags
          }
        </Head>
        <Body>
          <Main />
          <NextScript />
        </Body>
      </html>
    );
  }
}

const Body = styled.body`
  height: 100%;
  div#__next {
    height: 100%;
  }
  h1.meeting-list-header {
    display: inline;
    font-size: 30px;
    margin-left: 40px;
  }
`;
