export const levelsData = [
  {
    title: 'Level 1 title',
    description: 'select dots',
    task: 'make this 1',
    html: `<div class='field'>
    <dot></dot>
    <dot></dot>
</div>`,
    selector: 'dot',
  },
  {
    title: 'Level 2 title',
    description: 'description 2',
    task: 'select red dot',
    html: `<div class='field'>
    <dot class='red'></dot>
     <dot></dot>
</div>`,
    selector: '.red',
  },
  {
    title: 'Level 3 title',
    description: 'description 3',
    task: 'select blue dot inside red dot',
    html: `<div class='field'>
    <dot>
        <dot class='blue'></dot>
    </dot>
</div>`,
    selector: '.blue',
  },
];
