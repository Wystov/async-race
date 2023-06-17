export const levelsData = [
  {
    title: 'Hardest level',
    description: 'Do you know what a tag selector is?',
    task: 'Select all circles',
    html: `<div class='field'>
  <circle></circle>
  <underscore></underscore>
  <circle></circle>
</div>`,
    selector: 'circle',
  },
  {
    title: 'Title',
    description: 'Class selector is not a tag selector',
    task: 'Select red circle',
    html: `<div class='field'>
  <circle class='red'></circle>
  <circle></circle>
</div>`,
    selector: '.red',
  },
  {
    title: 'Not a title',
    description: 'All you have to do is count up to two.',
    task: 'You see what to select',
    html: `<div class='field'>
  <square class='blue'></square>
  <square class='blue'></square>
  <circle></circle>
</div>`,
    selector: '.blue:nth-child(2)',
  },
  {
    title: '',
    description: '',
    task: 'The dev made these lovely animations',
    html: `<div class='field'>
  <triangle></triangle>
  <triangle fake="attribute"></triangle>
  <triangle></triangle>
</div>`,
    selector: '[fake]',
  },
  {
    title: 'Things are getting serious',
    description: "Good luck, you'll need it!",
    task: 'Why should i tell you what to do?',
    html: `<div class="field">
  <triangle class="red"></triangle>
  <border>
    <triangle class="blue"></triangle>
    <triangle></triangle>
    <triangle class="red"></triangle>
    <circle class="green"></circle>
  </border>
</div>`,
    selector: 'border [class]',
  },
  {
    title: 'Hey',
    description: 'Did you really think there would be hints?',
    task: "So what's the point of my existance?",
    html: `<div class="field">
  <circle></circle>
  <square></square>
  <triangle class="red"></triangle>
  <border>
    <square></square>
    <triangle></triangle>
    <circle class="red"></circle>
  </border>
</div>`,
    selector: 'circle, border triangle',
  },
  {
    title: 'Maybe yes',
    description: 'Maybe not',
    task: 'Just a lonely div with text... How unsemantic of me!',
    html: `<div class="field">
  <triangle></triangle>
  <triangle></triangle>
  <triangle class="green"></triangle>
  <triangle></triangle>
  <triangle></triangle>
</div>`,
    selector: 'triangle:not(:first-of-type):not(.green)',
  },
  {
    title: '',
    description: 'Who knows...',
    task: 'Do you know what i dream about?',
    html: `<div class="field">
  <border>
    <circle class="red"></circle>
  </border>
  <border>
    <circle class="red"></circle>
    <circle class="red"></circle>
  </border>
  <border>
    <circle class="red"></circle>
  </border>
  <border>
    <circle class="red"></circle>
  </border>
</div>`,
    selector: 'circle:only-child, circle:nth-of-type(2)',
  },
  {
    title: '',
    description: "<div>'s dreams are made of this",
    task: 'I dream of becoming a REALLY BIG header one day.',
    html: `<div class="field">
  <circle class="blue"></circle>
  <square></square>
  <border>
    <square></square>
    <circle class="blue"></circle>
    <circle class="blue"></circle>
    <square></square>
    <triangle class="green"></triangle>
  </border>
</div>`,
    selector: '.blue ~ square, border > circle:first-of-type',
  },
  {
    title: '',
    description: 'Who am i to disagree',
    task: "<H1>! I'll be the main thing on the whole page!!",
    html: `<div class="field">
  </div>
  `,
    selector: '.field',
  },
  {
    title: '',
    description: 'The golden words',
    task: '',
    html: '<h1>And you should keep dreeming !</h1>',
    selector: 'h1',
  },
];
