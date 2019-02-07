Fxp BibScan for Njuko
=====================

The application BibScan for [Njuko](https://njuko.com) allow you to scan and check the bibs or print the bib labels,
one to one or in mass.

**Features include:**

- Manage the editions with your email and password or directly with the identifiers and API keys given
  by the Njuko application
- Search or scan the QR code of registration to validate the informations before collecting the bib
- Indicate on the registration that the bib has been retrieved by the runner or collected by the organizers
- Assign manually a bib number directly from the registration if the runner has not a bib
- Search or scan the QR code of bib and print his label
- Import in mass the list of bib numbers and print their labels
- Install this application on your device's home screen without the need for an app store
  (it's a Progressive Web Application)
- Direct connection with the Njuko APIs, so it is not necessary to use the local server *La box Njuko*

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

This [Progressive Web Application](https://bibscan.fxp.io) is deployed on the Github Pages services.

### Deploy the application in your own Github repository

1. Change the GIT url in the `bin/deploy` (linux/macos) or `bin/deploy.bat` (windows) file with your own
   Github repository
2. Change the APP domain in the `.env.production` file with your own url of the custom Github Pages
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
