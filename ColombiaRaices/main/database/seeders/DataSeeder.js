// Seeder para comunidades y experiencias con datos reales
const Database = require('../database');

class DataSeeder {
  constructor() {
    this.db = Database;
  }

  async run() {
    try {
      await this.db.connect();
      
      // Insertar comunidades reales
      await this.seedCommunities();
      
      // Insertar experiencias reales
      await this.seedExperiences();
      
      console.log('Data seeding completed successfully');
    } catch (error) {
      console.error('Data seeding failed:', error);
      throw error;
    }
  }
  async seedCommunities() {
    const communities = [
      {
        id: 1,
        name: 'Pueblo Kogui',
        region: 'Caribe',
        description: 'El pueblo Kogui habita la Sierra Nevada de Santa Marta, considerada un territorio sagrado. Conservan una cosmovisión espiritual basada en la armonía con la naturaleza. Se destacan por su organización ancestral, arquitectura en bahareque y saberes milenarios.',
        contact_email: 'turismokogui@sierra.com',
        contact_phone: '+57 300 123 4567',
        address: 'Comunidad Kogui, corregimiento de Minca, Santa Marta, Magdalena',
        latitude: 11.1380,
        longitude: -74.1052,        image_url: './images/communities/community_1.jpg'
      },
      {
        id: 2,
        name: 'Comunidad Wayuu',
        region: 'Caribe',
        description: 'El pueblo Wayuu es el más numeroso de Colombia y habita el desierto de La Guajira. Su cultura se expresa en el tejido de mochilas, la vida en rancherías y su fuerte identidad matriarcal.',
        contact_email: 'wayuuturismo@rancherias.co',
        contact_phone: '+57 301 987 6543',
        address: 'Ranchería de Nazareth, Uribia, La Guajira',
        latitude: 12.1422,
        longitude: -71.1995,        image_url: './images/communities/community_2.jpg'
      },
      {
        id: 3,
        name: 'Pueblo Misak (Guambianos)',
        region: 'Andina',
        description: 'Habitan en el resguardo de Guambia, Silvia (Cauca). Se identifican por su vestimenta colorida y su agricultura en altura. Tienen un calendario cultural basado en rituales y cosechas.',
        contact_email: 'misakturismo@silvia.org',
        contact_phone: '+57 312 345 6789',
        address: 'Resguardo de Guambia, Silvia, Cauca',
        latitude: 2.6147,
        longitude: -76.3793,        image_url: './images/communities/community_3.jpg'
      },
      {
        id: 4,
        name: 'Comunidad Campesina de San José de Apartadó',
        region: 'Andina',
        description: 'Comunidad de paz que ha resistido el conflicto armado a través de prácticas pacíficas, agroecología y memoria colectiva. Son un símbolo de dignidad campesina.',
        contact_email: 'comunidaddepaz@sanjose.org',
        contact_phone: '+57 313 456 7890',
        address: 'San José de Apartadó, Apartadó, Antioquia',
        latitude: 7.0032,
        longitude: -76.6666,        image_url: './images/communities/community_4.jpg'
      },
      {
        id: 5,
        name: 'Pueblo Nasa',
        region: 'Andina',
        description: 'Pueblo indígena del suroccidente colombiano. En Tierradentro (Cauca), conservan la relación con los hipogeos ancestrales, la medicina tradicional y el control territorial indígena.',
        contact_email: 'nasaturismo@tierradentro.co',
        contact_phone: '+57 314 567 8901',
        address: 'Resguardo Nasa, Inzá, Cauca',
        latitude: 2.5587,
        longitude: -76.0022,        image_url: './images/communities/community_5.jpg'
      }
    ];    for (const community of communities) {
      // Verificar si ya existe
      const existing = await this.db.get('SELECT id FROM communities WHERE id = ?', [community.id]);
      
      if (!existing) {        await this.db.run(`
          INSERT INTO communities (
            id, name, region, description, contact_email, contact_phone, 
            address, latitude, longitude, image_url, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
        `, [
          community.id, community.name, community.region, community.description,
          community.contact_email, community.contact_phone, community.address,
          community.latitude, community.longitude, community.image_url
        ]);        console.log(`✅ Inserted community: ${community.name}`);
      } else {
        // Actualizar registro existente
        await this.db.run(`
          UPDATE communities SET 
            name = ?, region = ?, description = ?, contact_email = ?, contact_phone = ?,
            address = ?, latitude = ?, longitude = ?, image_url = ?,
            updated_at = datetime('now')
          WHERE id = ?
        `, [
          community.name, community.region, community.description,
          community.contact_email, community.contact_phone, community.address,
          community.latitude, community.longitude, community.image_url,
          community.id
        ]);
        console.log(`✅ Updated community: ${community.name}`);
      }
    }
  }
  async seedExperiences() {
    const experiences = [
      {
        id: 1,
        title: 'Caminata Espiritual por la Sierra Nevada',
        description: 'Sendero guiado por mamos Kogui con paradas para rituales y conexión con la naturaleza. Incluye refrigerio.',
        community_id: 1,
        operator_id: 1,
        type: 'ecologica',
        price: 80000,
        duration_hours: 4,
        max_participants: 10,        image_url: './images/experiences/experience_1_thumbnail.jpg'
      },
      {
        id: 2,
        title: 'Visita Cultural a Comunidad Kogui',
        description: 'Encuentro con familias Kogui para conocer su cosmovisión, viviendas, tejidos y alimentación ancestral.',
        community_id: 1,
        operator_id: 1,
        type: 'cultural',
        price: 60000,
        duration_hours: 3,
        max_participants: 15,        image_url: './images/experiences/experience_2_thumbnail.jpg'
      },
      {
        id: 3,
        title: 'Taller de Tejido Wayuu',
        description: 'Taller práctico de tejido de mochilas, guiado por mujeres Wayuu. Incluye materiales, refrigerio y souvenir.',
        community_id: 2,
        operator_id: 1,
        type: 'cultural',
        price: 50000,
        duration_hours: 4,
        max_participants: 12,        image_url: './images/experiences/experience_3_thumbnail.jpg'
      },
      {
        id: 4,
        title: 'Ruta Desértica a Punta Gallinas',
        description: 'Recorrido en 4x4 con guía Wayuu por paisajes desérticos, miradores, Cabo de la Vela y Punta Gallinas. Incluye almuerzo típico.',
        community_id: 2,
        operator_id: 1,
        type: 'ecologica',
        price: 120000,
        duration_hours: 6,
        max_participants: 8,        image_url: './images/experiences/experience_4_thumbnail.jpeg'
      },
      {
        id: 5,
        title: 'Ruta Agroecológica Misak',
        description: 'Caminata guiada por cultivos de altura con explicación de técnicas tradicionales y consumo de alimentos locales.',
        community_id: 3,
        operator_id: 1,
        type: 'ecologica',
        price: 40000,
        duration_hours: 4,
        max_participants: 15,        image_url: './images/experiences/experience_5_thumbnail.jpg'
      },
      {
        id: 6,
        title: 'Vestimenta y Cultura Misak',
        description: 'Taller donde los visitantes visten ropa tradicional, participan en danzas y escuchan sobre el simbolismo cultural.',
        community_id: 3,
        operator_id: 1,
        type: 'cultural',
        price: 35000,
        duration_hours: 3,
        max_participants: 20,        image_url: './images/experiences/experience_6_thumbnail.jpg'
      },
      {
        id: 7,
        title: 'Taller de Cacao Orgánico Campesino',
        description: 'Experiencia en finca con recorrido por el proceso del cacao: cultivo, fermentado, secado y elaboración artesanal de chocolate.',
        community_id: 4,
        operator_id: 1,
        type: 'cultural',
        price: 45000,
        duration_hours: 4,
        max_participants: 15,        image_url: './images/experiences/experience_7_thumbnail.jpg'
      },
      {
        id: 8,
        title: 'Caminata de Memoria y Paz',
        description: 'Ruta guiada por lugares simbólicos del conflicto, con relatos vivos de resistencia campesina. Incluye refrigerio.',
        community_id: 4,
        operator_id: 1,
        type: 'historica',
        price: 40000,
        duration_hours: 3.5,
        max_participants: 12,        image_url: './images/experiences/experience_8_thumbnail.jpg'
      },
      {
        id: 9,
        title: 'Visita a los Hipogeos de Tierradentro',
        description: 'Recorrido por tumbas subterráneas ancestrales (hipogeos) con interpretación espiritual y cultural por guía Nasa.',
        community_id: 5,
        operator_id: 1,
        type: 'historica',
        price: 55000,
        duration_hours: 4,
        max_participants: 15,        image_url: './images/experiences/experience_9_thumbnail.jpg'
      },
      {
        id: 10,
        title: 'Ruta de Plantas Medicinales Nasa',
        description: 'Caminata por los alrededores del resguardo con sabedores tradicionales que explican usos rituales y curativos de plantas.',
        community_id: 5,
        operator_id: 1,
        type: 'cultural',
        price: 38000,
        duration_hours: 3,
        max_participants: 10,        image_url: './images/experiences/experience_10_thumbnail.jpeg'
      }
    ];    for (const experience of experiences) {
      // Verificar si ya existe
      const existing = await this.db.get('SELECT id FROM experiences WHERE id = ?', [experience.id]);
      
      if (!existing) {        await this.db.run(`
          INSERT INTO experiences (
            id, title, description, community_id, operator_id, type, price, 
            duration_hours, max_participants, image_url, 
            created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
        `, [
          experience.id, experience.title, experience.description, experience.community_id,
          experience.operator_id, experience.type, experience.price, experience.duration_hours,
          experience.max_participants, experience.image_url
        ]);        console.log(`✅ Inserted experience: ${experience.title}`);
      } else {
        // Actualizar registro existente
        await this.db.run(`
          UPDATE experiences SET 
            title = ?, description = ?, community_id = ?, operator_id = ?, type = ?,
            price = ?, duration_hours = ?, max_participants = ?, image_url = ?, 
            updated_at = datetime('now')
          WHERE id = ?
        `, [
          experience.title, experience.description, experience.community_id,
          experience.operator_id, experience.type, experience.price, experience.duration_hours,
          experience.max_participants, experience.image_url, 
          experience.id
        ]);
        console.log(`✅ Updated experience: ${experience.title}`);
      }
    }
  }
}

module.exports = DataSeeder;
