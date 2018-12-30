Fxp BibScan for Njuko
=====================

The application BibScan for Njuko allow you to scan and check the bibs or print the bib labels,
one to one or in mass.

**Features include:**

- Manage the editions with the identifiers and API keys given by the Njuko application
- Search or scan the QR code of registration to validate the informations before collecting the bib
- Search or scan the QR code of bib and print his label
- Import in mass the list of bib numbers and print their labels

> **Note:**
>
> This application was created to meet the needs of the organizers of the
> [Course du bord de Saône](https://courseduborddesaone.fr).

Installation
------------

This part requires the applications below installed on your computer:
- [Nodejs](https://nodejs.org)
- [Yarn](https://yarnpkg.com)
- [Git](https://git-scm.com)

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn run serve
```

### Compiles and minifies for production
```
yarn run build
```

### Lints and fixes files
```
yarn run lint
```

Deployment
----------

## Deploy the Progressive Web Application

This PWA is deployed on the Github Pages services, and the API proxy is deplaoyed on the AWS API Gateway.

### 1. Deploy the API Proxy

1. Change the `Access-Control-Allow-Origin` values in the `proxy/swagger-api-proxy-aws-apigateway.json` file
   by your own url of the Github Pages
2. Open the API Gateway service in the AWS Console
3. Create the API
  - Protocol: `REST`
  - New API: choose 'Import from Swagger file' and copy the content of your customized
    `proxy/swagger-api-proxy-aws-apigateway.json` file
  - Endpoint type: Edge optimized
  - Import the API
4. In resources section of your API Proxy:
  - Click on the action button and click on the 'Deploy API' button
  - Select 'New stage' for the Stage deployment field
  - Name the stage: `prod`
  - Deploy the stage
5. Copy the domain in the stage section of your API Proxy (findable in the URL of endpoint):
   `<id>.execute-api.<region>.amazonaws.com`
6. Create a CNAME in the DNS zone of your domain registrar with the domain of the API Proxy and your custom domain
7. In Domain name section, create a new custom domain:
  - Select the HTTP protocol
  - Name: your custom domain
  - Configuration of the endpoint: Optimized
  - Certificat ACM: select your own certificat for your custom domain
8. Always in the Domain section, and your domain for the API Proxy, add a mapping:
  - Path: `/`
  - Destination: select the API Proxy
  - Stage: select the prod stage

### 2. Deploy the PWA

1. Change the GIT url in the `bin/deploy` (linux/macos) or `bin/deploy.bat` (windows) file with your own
   Github repository
2. Change the API url and APP domain in the `.env.production` file with your own url of the API Proxy
   and the custom Github Pages
3. Create a CNAME in the DNS zone of your domain registrar with the domain of the Github User/Organization
   and your custom domain (format: `<username-or-organization>.github.io.`)
4. Run the command `yarn install`
5. Run the command `bin/deploy` (linux/macos) or `bin/deploy.bat` (windows)
6. In the setting page of the your Github repository, and the Github Pages section:
  - Select the `gh-pages branch` for the Source field
  - Add your custom domain in the Custom domain field (already added by the deployment)
  - Check the Enforce HTTPS field
7. Enjoy!

License
-------

This application is under the MIT license. See the complete license in the bundle:

[LICENSE](LICENSE)

About
-----

Fxp BibScan for Njuko is a [François Pluchino](https://github.com/francoispluchino) initiative.
See also the list of [contributors](https://github.com/fxpio/fxp-bibscan-njuko/graphs/contributors).

Reporting an issue or a feature request
---------------------------------------

Issues and feature requests are tracked in the [Github issue tracker](https://github.com/fxpio/fxp-bibscan-njuko/issues).
