import type { Doc } from './types';

export const SELECTOR_STUDIO: Record<string, Doc> = {
  '/tools/selector-studio': {
    title: 'Selector Studio',
    category: 'Tools',
    audience: 'Researchers and developers',
    description: 'Open a page in Chromium, visually choose dataset fields, and export a Crawlingo job.',
    sections: [
      {
        id: 'interactive', title: 'Watch the spider collect',
        paragraphs: [
          'Open a URL and click Watch spider collect. The tool detects a likely group of repeated records, scrolls to each record, animates the spider grabbing it, and adds its title, visible text and first HTTP(S) link to the preview. At completion it saves records.json locally; the terminal prints the folder.',
          'The spider stays fixed at the screen center. Only the leg nearest the current record extends, grips and retracts; the other seven stay in their resting animation. Use Gentle, Normal or Quick animation speed in the compact bottom panel. Progress and the captured record count update as it works. Expand Collected records to review and save, or expand the selector controls to configure a job manually. Hide spider clears the mascot without stopping the pass.',
          'This heuristic preview is limited to 30 records already on the current page. It does not follow links, paginate or exhaust infinite scrolling. Review the inferred records. If the detected group is wrong, choose a row selector manually and try again. Stop interrupts the pass; Save collected JSON saves the partial result.',
        ],
      },
      {
        id: 'overview', title: 'What it does',
        paragraphs: [
          'Selector Studio is an optional tool in the development source tree. It opens a URL in a temporary Playwright Chromium window with an animated spider and a selector inspector. Hover over the page, click an element to catch it, and build a list of dataset fields.',
          'The tool exports job.json and urls.txt locally. It is not a hosted service, and it is not included in the published npm or Python SDK packages. It does not run the dataset job for you.',
        ],
      },
      {
        id: 'install', title: 'Install and open a page',
        paragraphs: ['Clone the Crawlingo source, install Node.js 22 or newer, then install the tool dependencies and Playwright Chromium. Run these commands from your checkout:'],
        code: [{ label: 'Terminal', language: 'shell', code: 'cd tools/selector-studio\nnpm ci\nnpx playwright install chromium\nnpm start' }],
        bullets: ['Enter a URL on the start screen and choose Open in Studio. On the page, choose Watch spider collect or expand the manual selector controls.', 'To skip the start screen, run npm start -- https://peps.python.org/numerical/ with your desired URL. Use the browser Back button to return to the start screen.', 'The window uses a temporary browser context. Close the window to stop the tool.', 'Use --output followed by a directory after the URL to choose where export folders are created.'],
      },
      {
        id: 'pick', title: 'Pick rows and fields',
        bullets: [
          'Expand Choose selectors & configure a dataset job, then hover over an element in Pick element mode. The spider stays in the screen center while the outline tracks your target. Click to extend the legs and grip it.',
          'For repeated records, select a record container and choose Use as rows. Select parent moves up one level if you clicked a child. Review the row count before choosing fields.',
          'Pick a field inside a row, choose Text or an attribute such as href, enter a field name, check the preview and choose Add field. Repeat for each column.',
          'Use Preview matches after editing a selector manually. Copy selector and Copy job JSON are available when the page permits clipboard access.',
          'Choose Browse page or press Escape to use page controls and links normally; switch back to Pick element to select again. Collapse the panel with the minus button.',
        ],
      },
      {
        id: 'run', title: 'Export and run the job',
        paragraphs: [
          'Export files creates a new folder and prints its path in the terminal. The folder contains job.json and urls.txt. The initial job contains the current URL, enables robots.txt checking, and writes JSONL using two workers.',
          'Build the CLI from the repository root. Change into the printed export folder and invoke the built CLI using its absolute path. The example path below is for a checkout at D:\\Scraper; replace it with your own.',
        ],
        code: [{ label: 'PowerShell', language: 'powershell', code: 'cd D:\\Scraper\ncargo build --locked --release --features cli\ncd tools\\selector-studio\\exports\\selection-<id>\nD:\\Scraper\\target\\release\\crawlingo.exe dataset job.json' }],
        links: [{ label: 'Dataset job reference', href: '/reference/dataset-job' }, { label: 'Production guide', href: '/production-guide' }],
      },
      {
        id: 'limits', title: 'Preview and extraction are different',
        paragraphs: [
          'Preview uses the rendered browser DOM. Crawlingo dataset jobs fetch HTML separately over HTTP; they do not inherit the browser DOM, JavaScript execution, cookies or login. A browser match does not guarantee that the job can extract the same field. Run a small job and inspect its report and records first.',
          'Selectors support tags, classes, IDs, descendant spaces and positive :nth-child(N). The inspector targets the top-level document, not iframe or shadow-root contents. Prefer non-overlapping row containers; nested row containers can group fields differently in the engine.',
          'Navigation resets the current selection. Remove saved fields before changing their row selector. The generated URL file contains one URL; review and expand it for your actual collection.',
        ],
        links: [{ label: 'Playwright integration guide', href: '/integrations/playwright' }],
      },
    ],
  },
};
