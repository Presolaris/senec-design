#!/bin/bash

# Update gewerbe.astro
sed -i 's|<Layout title="Photovoltaik für Gewerbe & Industrie | Wirtschaftlichkeit für Leipzig">|<Layout \n  title="Photovoltaik für Gewerbe \& Industrie | Wirtschaftlichkeit für Leipzig"\n  description="Senken Sie Ihre Energiekosten mit gewerblichen Solaranlagen. Maximale Wirtschaftlichkeit für Ihr Unternehmen in Leipzig und Umgebung."\n  ogImage="/images/hero-home.png"\n  canonical="https://leipzig-photovoltaik.de/gewerbe"\n>|' src/pages/gewerbe.astro

# Update service.astro
sed -i 's|<Layout title="Service & Wartung | Langlebigkeit für Ihre PV-Anlage">|<Layout \n  title="Service \& Wartung | Langlebigkeit für Ihre PV-Anlage"\n  description="Professionelle Wartung, Reinigung und Reparatur Ihrer Photovoltaikanlage. Maximale Erträge durch regelmäßigen Service in Leipzig."\n  ogImage="/images/installation.png"\n  canonical="https://leipzig-photovoltaik.de/service"\n>|' src/pages/service.astro

# Update wallbox.astro  
sed -i 's|<Layout title="Wallbox & E-Mobilität | Tanken Sie Sonne">|<Layout \n  title="Wallbox \& E-Mobilität | Tanken Sie Sonne"\n  description="Laden Sie Ihr E-Auto mit eigenem Solarstrom. Intelligente Wallbox-Lösungen mit Lademanagement für Leipzig und Umgebung."\n  ogImage="/images/wallbox.png"\n  canonical="https://leipzig-photovoltaik.de/wallbox"\n>|' src/pages/wallbox.astro

# Update referenzen.astro
sed -i 's|<Layout title="Referenzen | Erfolgreiche Projekte in Leipzig">|<Layout \n  title="Referenzen | Erfolgreiche Projekte in Leipzig"\n  description="Überzeugen Sie sich von unseren realisierten Photovoltaik-Projekten in Leipzig und Umgebung. Von Einfamilienhäusern bis Gewerbeanlagen."\n  ogImage="/images/installation.png"\n  canonical="https://leipzig-photovoltaik.de/referenzen"\n>|' src/pages/referenzen.astro

# Update kontakt.astro
sed -i 's|<Layout title="Kontakt | Jetzt beraten lassen">|<Layout \n  title="Kontakt | Jetzt beraten lassen"\n  description="Kontaktieren Sie uns für eine kostenlose Beratung zu Photovoltaik, Stromspeicher und Wallbox. Ihr Experte in Leipzig und Umgebung."\n  ogImage="/images/hero-home.png"\n  canonical="https://leipzig-photovoltaik.de/kontakt"\n>|' src/pages/kontakt.astro

echo "SEO meta tags updated for all pages"
