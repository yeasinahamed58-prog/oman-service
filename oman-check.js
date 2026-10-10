

const db = window.supabase.createClient(
  'https://akgccscqnnmfdcnrliuw.supabase.co',
  'sb_publishable_vTh846CiHW5K1pya-AqhKw_1yKayC8w'
);

async function renderWorkers(filter='') {
  const list = document.getElementById('workerList');
  list.textContent = 'Loading workers...';

  let query = db.from('workers')
    .select('id,name,phone,type,city')
    .order('id', {ascending: false});

  if (filter) query = query.eq('type', filter);

  const {data, error} = await query;
  list.innerHTML = '';

  if (error) {
    list.textContent = 'Could not load workers: ' + error.message;
    return;
  }

  if (!data || data.length === 0) {
    list.textContent = 'No workers registered for this service yet.';
    return;
  }

  data.forEach(w => {
    const card = document.createElement('div');
    card.style.cssText =
      'background:white;padding:12px;margin:8px 0;border-radius:8px';

    const title = document.createElement('h3');
    title.textContent = w.name + ' — ' + w.type;

    const phone = document.createElement('p');
    phone.textContent = w.phone;

    const city = document.createElement('p');
    city.textContent = 'City: ' + (w.city || 'Not specified');

    const call = document.createElement('a');
    call.textContent = 'Call Worker';
    call.href = 'tel:' + w.phone;
    call.style.marginRight = '15px';

    const wa = document.createElement('a');
    wa.textContent = 'WhatsApp';
    wa.href = 'https://wa.me/' + w.phone.replace(/\D/g, '');
    wa.target = '_blank';
    wa.rel = 'noopener';

    card.append(title, phone, city, call, wa);
    list.appendChild(card);
  });
}

async function registerWorker() {
  const name = document.getElementById('workerName').value.trim();
  const phone = document.getElementById('workerPhone').value.trim();
  const type = document.getElementById('workerType').value;
  const city = document.getElementById('workerCity').value.trim();

  if (!name || !phone || !city) {
    alert('Enter your name, phone number and city');
    return;
  }

  const button = document.querySelector(
    'button[onclick="registerWorker()"]'
  );
  button.disabled = true;

  const {error} = await db.from('workers').insert([
    {name, phone, type, city}
  ]);

  button.disabled = false;

  if (error) {
    alert('Registration failed: ' + error.message);
    return;
  }

  document.getElementById('workerName').value = '';
  document.getElementById('workerPhone').value = '';
  document.getElementById('workerCity').value = '';

  await renderWorkers();
  alert('Worker registered successfully!');
}

function searchServices() {
  const q = document.getElementById('search').value.toLowerCase();
  document.querySelectorAll('.service').forEach(item => {
    item.style.display =
      item.textContent.toLowerCase().includes(q) ? '' : 'none';
  });
}

function openService(name) {
  document.getElementById('contact').style.display = 'block';
  document.getElementById('chosen').textContent = name;
  renderWorkers(name);
}

function callWorker() {
  const phone = document.getElementById('phone').value.trim();
  if (!phone) {
    alert('Enter worker phone number first');
    return;
  }
  location.href = 'tel:' + phone;
}

function whatsappWorker() {
  const phone = document.getElementById('phone').value.replace(/\D/g, '');
  if (!phone) {
    alert('Enter worker phone number first');
    return;
  }
  window.open('https://wa.me/' + phone, '_blank', 'noopener');
}

renderWorkers();
