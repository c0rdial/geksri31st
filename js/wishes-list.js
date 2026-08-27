export function renderWishesList(container, wishes) {
  container.innerHTML = '';
  const list = document.createElement('ul');
  list.className = 'wishes-list';

  for (const wish of wishes) {
    const item = document.createElement('li');
    item.className = 'wishes-list__item';

    const name = document.createElement('a');
    name.className = 'wishes-list__name';
    name.href = `person.html?name=${encodeURIComponent(wish.name)}`;
    name.textContent = wish.name;

    const message = document.createElement('p');
    message.className = 'wishes-list__message';
    message.textContent = wish.wish;

    item.append(name, message);
    list.appendChild(item);
  }

  container.appendChild(list);
}
