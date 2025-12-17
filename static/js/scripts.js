const content_dir = 'contents/'
const config_file = 'config.yml'
const section_names = ['home', 'speakers', 'talks', 'schedule', 'participants', 'venue', 'registration']

window.addEventListener('DOMContentLoaded', event => {

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

    // YAML
    fetch(content_dir + config_file)
        .then(response => response.text())
        .then(text => {
            const yml = jsyaml.load(text);
            Object.keys(yml).forEach(key => {
                try {
                    document.getElementById(key).innerHTML = yml[key];
                } catch {
                    console.log("Unknown id and value: " + key + "," + yml[key].toString())
                }
            })
        })
        .catch(error => console.log(error));

    // MARKDOWN
    marked.use({ mangle: false, headerIds: false })

    // Create an array of Promises for all Markdown fetches
    const markdownPromises = section_names.map(name => 
        fetch(content_dir + name + '.md')
            .then(response => response.text())
            .then(markdown => {
                const html = marked.parse(markdown);
                document.getElementById(name + '-md').innerHTML = html;
            })
            .then(() => {
                // MathJax rendering
                MathJax.typeset();
            })
            .catch(error => console.log(error))
    );

    // Once all Markdown content is loaded, initialize ScrollSpy
    Promise.all(markdownPromises).then(() => {
        const mainNav = document.body.querySelector('#mainNav');
        if (mainNav) {
            const scrollSpy = new bootstrap.ScrollSpy(document.body, {
                target: '#mainNav',
                offset: 74
            });
            scrollSpy.refresh();
        }
    });

});
