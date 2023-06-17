export const levelsData = [
  {
    title: 'Tag selector',
    description:
      'With tag selector you can select all elements that match tag name.',
    task: 'Select all <circle> elements',
    html: `<div class='field'>
  <circle></circle>
  <square></square>
  <circle></circle>
</div>`,
    selector: 'circle',
  },
  {
    title: 'Level 2 title',
    description: 'description 2',
    task: 'select red circle',
    html: `<div class='field'>
  <circle class='red'></circle>
  <circle></circle>
</div>`,
    selector: '.red',
  },
];
