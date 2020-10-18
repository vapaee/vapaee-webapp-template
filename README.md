# Vapaée Webapp Template
This is a template for a web-app working with Telos blockchain. Vapaée is a company committed to creating excellent web apps for this ecosystem, so this project will be permanently used as the start point for most of the projects made by Vapaée.

### Add new Page
- copy src/app/pages/example
- paste it as src/app/pages/my-new-section
- rename all the files inside that folder from example*.* to my-new-section*.*
- inside src/app/pages/my-new-section/my-new-section.page.ts change the name of the class from ExamplePage to MyNewSectionPage
- import the Component in src/app/pages/pages.module.ts and include MyNewSectionPage in declarations and exports lists           
- add a new rule in src/app/app-routing.module.ts for the new page
