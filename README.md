# DoramasJing

Doramas en español latino y subtitulado para Kino, con la firma de Susejing. Hermano de AniJing y MangaTrack: mismo espíritu, mismas manías, mismo amor por las series asiáticas.

## Fuentes (v0.1)

| Fuente | Qué trae | Estado |
| --- | --- | --- |
| Kdramas.lat | Inicio, catálogo, búsqueda, fichas | Parser generoso: afincar con sondeo |
| Yandispoiler.net | Inicio, series, temporadas, episodios | Episodios por patrón de URL; servidores tras el juego de flores: afincar con sondeo |
| DoramasLatinoX | Inicio, catálogo, búsqueda, fichas | Parser generoso: afincar con sondeo |

La búsqueda une las tres fuentes y quita repetidas. El Inicio nunca revienta: si una fuente no trae nada, la fila avisa y sigue.

## El reproductor

La **v0.1.0 «la lupa del primer día»** trae catálogo, fichas, búsqueda, episodios de Yandispoiler y sondeos. El reproductor real llega en la **0.2**: al tocar reproducir, el plugin lo dice honestamente (la aduana de la flor de Yandispoiler y los servidores de cada sitio se afincan con datos del registro, no a ciegas).

## Cómo ayudar (2 minutos)

1. Instala el plugin desde `github.com/Susejing/DoramasJing` y aprueba sus 7 hosts.
2. Entra a Ajustes de DoramasJing y toca, uno por uno: **Sondear Kdramas.lat**, **Sondear Yandispoiler**, **Sondear DoramasLatinoX**.
3. Manda el Registro de DoramasJing: cada sondeo escribe huellas del HTML real (vocabulario, inventario de anclas, huérfanas) y con eso se escriben los parsers finos y el reproductor de la 0.2.

## Historia

- **0.1.0** — **la lupa del primer día**: nace DoramasJing con tres fuentes (Kdramas.lat, Yandispoiler, DoramasLatinoX), búsqueda unida, Inicio blindado, episodios de Yandispoiler por patrón de URL (con el slash final opcional: los anclajes reales terminan en barra) y tres sondeos que escriben el registro. El buque: si un host directo no pasa, reintenta por el traductor.

## Licencia

GPL-3.0: usa, mejora y comparte con crédito.
