import type { Category } from './types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'filmes',
    name: 'Filmes',
    words: [
      { text: 'Titanic', hint: 'Envolve um grande desastre histórico e uma relação marcante.' },
      { text: 'Avatar', hint: 'Se passa em uma lua alienígena com seres de pele azul.' },
      { text: 'Shrek', hint: 'Um ogro verde tenta salvar seu pântano e resgatar uma princesa.' },
      { text: 'Interestelar', hint: 'Envolve viagens espaciais, buracos negros e a salvação da humanidade.' },
      { text: 'Matrix', hint: 'Fala sobre a simulação da realidade e a escolha de uma pílula vermelha.' },
      { text: 'Inception', hint: 'Envolve a invasão de sonhos dentro de sonhos.' },
      { text: 'Vingadores', hint: 'Super-heróis se unem para derrotar um vilão que busca joias espaciais.' },
      { text: 'Star Wars', hint: 'Uma ópera espacial clássica com sabres de luz e naves.' },
      { text: 'Coringa', hint: 'Explora a origem de um famoso palhaço psicopata em uma Gotham caótica.' },
      { text: 'O Rei Leão', hint: 'A jornada de um jovem felino para assumir seu trono após a perda do pai.' },
      { text: 'Jurassic Park', hint: 'Clones de dinossauros escapam de um parque de diversões.' },
      { text: 'Harry Potter', hint: 'Um menino órfão descobre ser bruxo em uma escola de magia.' },
      { text: 'Toy Story', hint: 'Brinquedos ganham vida quando os humanos não estão por perto.' },
      { text: 'Pulp Fiction', hint: 'Filme cult não linear sobre criminosos em Los Angeles.' },
      { text: 'Gladiador', hint: 'Um general romano é traído e luta na arena por vingança.' },
      { text: 'O Poderoso Chefão', hint: 'Acompanha a família mafiosa de Don Corleone.' }
    ]
  },
  {
    id: 'paises',
    name: 'Países',
    words: [
      { text: 'Brasil', hint: 'Famoso pelo futebol, carnaval e pela Floresta Amazônica.' },
      { text: 'Itália', hint: 'Conhecido pela culinária de massas, o Coliseu e formato de bota.' },
      { text: 'Japão', hint: 'Terra do sol nascente, anime e culinária de peixe cru.' },
      { text: 'Egito', hint: 'Conhecido por suas pirâmides milenares e pelo Rio Nilo.' },
      { text: 'Canadá', hint: 'Famoso pelo xarope de bordo, frio intenso e folha na bandeira.' },
      { text: 'Austrália', hint: 'Lar dos cangurus, coalas e cercado por praias e corais.' },
      { text: 'França', hint: 'Famoso por sua torre emblemática, culinária e croissants.' },
      { text: 'Alemanha', hint: 'Conhecido pela Oktoberfest, cervejas e carros de alta tecnologia.' },
      { text: 'México', hint: 'Conhecido pelo dia dos mortos, tacos e chapéus sombreros.' },
      { text: 'Índia', hint: 'Famoso pelo Taj Mahal, especiarias e vacas nas ruas.' },
      { text: 'Argentina', hint: 'Famoso pelo tango, carne assada e país vizinho ao Brasil.' },
      { text: 'Rússia', hint: 'O maior país em extensão territorial, famoso pelo frio e Kremlin.' },
      { text: 'China', hint: 'O país mais populoso da Ásia, lar da Grande Muralha.' },
      { text: 'África do Sul', hint: 'Famoso pelos safáris e por ter três capitais oficiais.' },
      { text: 'Portugal', hint: 'Conhecido pelo pastel de nata e colonizador do Brasil.' },
      { text: 'Espanha', hint: 'Terra do flamenco, paella e das touradas.' },
      { text: 'Grécia', hint: 'Berço da filosofia ocidental, com ruínas antigas e ilhas brancas.' },
      { text: 'Estados Unidos', hint: 'Lar da Estátua da Liberdade, Hollywood e fast food.' }
    ]
  },
  {
    id: 'comidas',
    name: 'Comidas',
    words: [
      { text: 'Pizza', hint: 'De origem italiana, servida em fatias redondas com queijo e molho.' },
      { text: 'Sushi', hint: 'Pedaços pequenos de arroz temperado combinados com peixe ou alga.' },
      { text: 'Hambúrguer', hint: 'Disco de carne grelhada servido entre duas fatias de pão redondo.' },
      { text: 'Lasanha', hint: 'Camadas alternadas de massa, molho, carne e queijo.' },
      { text: 'Churrasco', hint: 'Carne assada em espetos ou grelha sobre brasa viva.' },
      { text: 'Tacos', hint: 'Tortilha de milho dobrada recheada com carne e tempero apimentado.' },
      { text: 'Macarronada', hint: 'Massa longa regada a molho de tomate ou bolonhesa.' },
      { text: 'Pastel', hint: 'Massa frita muito crocante comum em feiras livres.' },
      { text: 'Brigadeiro', hint: 'Doce tradicional brasileiro feito de leite condensado e chocolate granulado.' },
      { text: 'Coxinha', hint: 'Salgado frito com recheio de frango em formato de gota.' },
      { text: 'Estrogonofe', hint: 'Carne cremosa com cogumelos, servida com arroz e batata palha.' },
      { text: 'Açaí', hint: 'Fruta roxa da Amazônia consumida gelada no copo ou tigela.' },
      { text: 'Feijoada', hint: 'Gisado de feijão preto com várias carnes de porco.' },
      { text: 'Risoto', hint: 'Arroz cremoso italiano cozido lentamente com caldo e queijo.' },
      { text: 'Panqueca', hint: 'Disco fino de massa enrolado com recheio salgado ou doce.' },
      { text: 'Croissant', hint: 'Pão folhado de massa amanteigada em formato de lua crescente.' }
    ]
  },
  {
    id: 'celebridades',
    name: 'Celebridades',
    words: [
      { text: 'Neymar', hint: 'Famoso jogador de futebol brasileiro conhecido pelo estilo ousado.' },
      { text: 'Beyoncé', hint: 'Diva pop internacional aclamada como Queen Bey.' },
      { text: 'Keanu Reeves', hint: 'Ator de Matrix e John Wick, famoso por sua humildade.' },
      { text: 'Lionel Messi', hint: 'Futebolista argentino multicampeão, famoso por sua genialidade canhota.' },
      { text: 'Taylor Swift', hint: 'Cantora de imenso sucesso pop com fãs chamados Swifties.' },
      { text: 'Lady Gaga', hint: 'Cantora conhecida por performances extravagantes e pelo papel em Nasce Uma Estrela.' },
      { text: 'Cristiano Ronaldo', hint: 'Futebolista português famoso por sua disciplina e o grito SIUU.' },
      { text: 'Brad Pitt', hint: 'Galã de Hollywood famoso por Clube da Luta.' },
      { text: 'Anitta', hint: 'Cantora brasileira que conquistou carreira internacional.' },
      { text: 'Rihanna', hint: 'Cantora de Barbados dona de uma grande marca de maquiagem.' },
      { text: 'Michael Jackson', hint: 'O lendário Rei do Pop que popularizou o passo Moonwalk.' },
      { text: 'Leonardo DiCaprio', hint: 'Ator de Titanic que levou anos para ganhar seu primeiro Oscar.' },
      { text: 'Shakira', hint: 'Cantora colombiana famosa pela dança do ventre e hits latinos.' },
      { text: 'Elon Musk', hint: 'Bilionário de tecnologia espacial e carros elétricos.' },
      { text: 'Will Smith', hint: 'Famoso ator que protagonizou Um Maluco no Pedaço.' },
      { text: 'Selena Gomez', hint: 'Atriz e cantora que começou na Disney.' }
    ]
  },
  {
    id: 'series',
    name: 'Séries',
    words: [
      { text: 'Breaking Bad', hint: 'Um professor de química passa a fabricar substâncias ilícitas.' },
      { text: 'Game of Thrones', hint: 'Famílias nobres lutam pelo Trono de Ferro com ajuda de dragões.' },
      { text: 'Stranger Things', hint: 'Crianças enfrentam monstros no Mundo Invertido nos anos 80.' },
      { text: 'Friends', hint: 'Seis amigos vivem em Nova York e frequentam o café Central Perk.' },
      { text: 'The Office', hint: 'Dia a dia cômico em estilo documentário de uma empresa de papel.' },
      { text: 'Dark', hint: 'Envolve desaparecimentos e viagens complexas no tempo em uma floresta.' },
      { text: 'La Casa de Papel', hint: 'Grupo assalta a Casa da Moeda espanhola usando macacões vermelhos.' },
      { text: 'The Crown', hint: 'Drama histórico que narra a vida da Rainha Elizabeth II.' },
      { text: 'Black Mirror', hint: 'Série antológica que explora o lado obscuro da tecnologia.' },
      { text: 'Grey\'s Anatomy', hint: 'Longo drama médico focado em cirurgiões e seus romances.' },
      { text: 'Chernobyl', hint: 'Mini-série sobre o desastre nuclear soviético.' },
      { text: 'Peaky Blinders', hint: 'Gangue inglesa liderada por Tommy Shelby que usa boinas com navalhas.' },
      { text: 'Lost', hint: 'Sobreviventes de acidente aéreo tentam escapar de uma ilha misteriosa.' },
      { text: 'Naruto', hint: 'Anime de um jovem ninja órfão que sonha em ser Hokage.' },
      { text: 'One Piece', hint: 'Piratas navegam os mares em busca do tesouro lendário.' },
      { text: 'Succession', hint: 'Filhos disputam o controle do império de mídia do pai.' }
    ]
  },
  {
    id: 'personagens',
    name: 'Personagens',
    words: [
      { text: 'Batman', hint: 'Herói rico que se veste de morcego para combater o crime em Gotham.' },
      { text: 'Homem-Aranha', hint: 'Jovem que escala paredes e solta teias após picada de inseto.' },
      { text: 'Pikachu', hint: 'Criatura amarela elétrica mascote de uma franquia de monstros de bolso.' },
      { text: 'Harry Potter', hint: 'Menino órfão com cicatriz de raio que frequenta Hogwarts.' },
      { text: 'Goku', hint: 'Guerreiro alienígena que treina artes marciais e vira Super Saiyajin.' },
      { text: 'Mickey Mouse', hint: 'Camundongo que é símbolo máximo dos desenhos animados.' },
      { text: 'Bob Esponja', hint: 'Personagem amarelo que mora em uma calça quadrada no fundo do mar.' },
      { text: 'Mario', hint: 'Encanador bigodudo que resgata a Princesa Peach de uma tartaruga gigante.' },
      { text: 'Naruto', hint: 'Ninja loiro com marcas nas bochechas que tem uma raposa selada dentro de si.' },
      { text: 'Darth Vader', hint: 'Vilão de armadura preta que diz "Eu sou seu pai".' },
      { text: 'Sherlock Holmes', hint: 'Detetive britânico hiper-dedutivo que reside na Baker Street.' },
      { text: 'Coringa', hint: 'Nêmesis caótico do Batman com sorriso pintado.' },
      { text: 'Homer Simpson', hint: 'Pai de família cômico que ama rosquinhas e trabalha em usina nuclear.' },
      { text: 'Barbie', hint: 'Boneca famosa de plástico conhecida por ser tudo que quiser ser.' },
      { text: 'Elsa', hint: 'Rainha com poderes de gelo que canta "Livre Estou".' },
      { text: 'Homem de Ferro', hint: 'Bilionário filantropo de armadura vermelha e dourada.' }
    ]
  },
  {
    id: 'animais',
    name: 'Animais',
    words: [
      { text: 'Leão', hint: 'Grande felino carnívoro conhecido como o rei da selva.' },
      { text: 'Elefante', hint: 'Mamífero terrestre gigante famoso por sua tromba.' },
      { text: 'Cachorro', hint: 'Domesticado amigável conhecido como o melhor amigo do homem.' },
      { text: 'Gato', hint: 'Felino de estimação ágil que ronrona e limpa a si mesmo.' },
      { text: 'Golfinho', hint: 'Mamífero marinho inteligente conhecido por seus saltos.' },
      { text: 'Águia', hint: 'Ave de rapina com visão aguçada e garras fortes.' },
      { text: 'Tubarão', hint: 'Grande peixe predador temido nos oceanos por seus dentes afiados.' },
      { text: 'Urso', hint: 'Grande animal peludo de florestas frias que adora mel e hiberna.' },
      { text: 'Girafa', hint: 'Animal africano de pescoço comprido e manchas marrons.' },
      { text: 'Zebra', hint: 'Mamífero herbívoro com listras pretas e brancas.' },
      { text: 'Cobra', hint: 'Réptil rastejante sem patas, algumas espécies são peçonhentas.' },
      { text: 'Macaco', hint: 'Primata ágil de florestas que adora subir em árvores.' },
      { text: 'Pinguim', hint: 'Ave marinha que não voa, veste um "fraque" e vive no frio.' },
      { text: 'Jacaré', hint: 'Réptil semiaquático com mandíbulas fortes e escamas duras.' },
      { text: 'Canguru', hint: 'Mamífero australiano que salta e carrega filhotes na bolsa.' },
      { text: 'Lobo', hint: 'Canídeo selvagem que caça em alcateias e uiva para a lua.' },
      { text: 'Tigre', hint: 'Grande felino listrado de cor laranja e preto.' },
      { text: 'Coruja', hint: 'Ave noturna conhecida por sua sabedoria e pescoço flexível.' }
    ]
  },
  {
    id: 'lugares',
    name: 'Lugares',
    words: [
      { text: 'Praia', hint: 'Faixa de areia à beira-mar procurada no calor.' },
      { text: 'Paris', hint: 'Cidade europeia famosa pela Torre Eiffel e romance.' },
      { text: 'Roma', hint: 'Capital histórica famosa pelo Coliseu e fontes barrocas.' },
      { text: 'Nova York', hint: 'Metrópole com a Times Square e Central Park.' },
      { text: 'Floresta Amazônica', hint: 'Vasta floresta equatorial rica em vida selvagem e rios.' },
      { text: 'Deserto do Saara', hint: 'Extensão de dunas áridas no norte da África.' },
      { text: 'Disney', hint: 'Destino de férias famoso por seus castelos e personagens de contos.' },
      { text: 'Torre Eiffel', hint: 'Monumento de ferro de Paris.' },
      { text: 'Muralha da China', hint: 'Estrutura defensiva milenar visível do espaço.' },
      { text: 'Cinema', hint: 'Local para assistir a lançamentos audiovisuais em tela grande.' },
      { text: 'Shopping', hint: 'Centro comercial com lojas, praça de alimentação e lazer.' },
      { text: 'Escola', hint: 'Instituição de ensino com salas de aula e professores.' },
      { text: 'Academia', hint: 'Espaço com aparelhos para musculação e condicionamento físico.' },
      { text: 'Aeroporto', hint: 'Terminal com pistas para pousos e decolagens de aviões.' },
      { text: 'Hospital', hint: 'Local de atendimento médico de emergência e tratamentos.' },
      { text: 'Biblioteca', hint: 'Local silencioso para empréstimo e leitura de livros.' }
    ]
  },
  {
    id: 'objetos',
    name: 'Objetos',
    words: [
      { text: 'Celular', hint: 'Aparelho portátil moderno indispensável para comunicação.' },
      { text: 'Relógio', hint: 'Acessório de pulso ou parede para medir as horas.' },
      { text: 'Óculos', hint: 'Lentes montadas em armação no rosto para corrigir a visão.' },
      { text: 'Caneta', hint: 'Tubo cilíndrico contendo tinta para escrita manual.' },
      { text: 'Caderno', hint: 'Conjunto de folhas encadernadas usado para anotações estudantis.' },
      { text: 'Chave', hint: 'Objeto de metal recortado usado para abrir portas.' },
      { text: 'Carteira', hint: 'Pequeno estojo plano para carregar cédulas e cartões.' },
      { text: 'Garrafa', hint: 'Recipiente alongado usado para armazenar líquidos.' },
      { text: 'Mochila', hint: 'Bolsa com alças usada nas costas para transportar objetos.' },
      { text: 'Cadeira', hint: 'Móvel individual com encosto destinado a sentar.' },
      { text: 'Computador', hint: 'Máquina eletrônica com monitor e teclado usada para trabalho ou jogos.' },
      { text: 'Guarda-chuva', hint: 'Dispositivo dobrável de lona usado para se proteger de intempéries.' },
      { text: 'Espelho', hint: 'Superfície de vidro que reflete a imagem de quem olha.' },
      { text: 'Sapato', hint: 'Calçado fechado usado para proteger os pés.' },
      { text: 'Travesseiro', hint: 'Almofada macia usada para apoiar a cabeça ao dormir.' },
      { text: 'Fone de Ouvido', hint: 'Acessório auricular usado para escutar áudio isoladamente.' }
    ]
  },
  {
    id: 'esportes',
    name: 'Esportes',
    words: [
      { text: 'Futebol', hint: 'Jogado com os pés, tentando marcar gols em traves opostas.' },
      { text: 'Basquete', hint: 'Jogado arremessando uma bola em uma cesta elevada.' },
      { text: 'Vôlei', hint: 'Times separados por uma rede tentam fazer a bola tocar a quadra adversária.' },
      { text: 'Tênis', hint: 'Jogado com raquetes rebatendo uma bolinha amarela por cima da rede.' },
      { text: 'Natação', hint: 'Competição de velocidade na água usando braçadas.' },
      { text: 'Corrida', hint: 'Disputa de velocidade a pé em pistas ou ruas.' },
      { text: 'Ciclismo', hint: 'Corrida de velocidade utilizando bicicletas.' },
      { text: 'Skate', hint: 'Equilíbrio sobre prancha com rodinhas fazendo manobras.' },
      { text: 'Judô', hint: 'Arte marcial focada em derrubar e imobilizar o oponente.' },
      { text: 'Boxe', hint: 'Esporte de combate usando apenas os punhos com luvas.' },
      { text: 'Surf', hint: 'Deslizar sobre as ondas do mar em pé sobre uma prancha.' },
      { text: 'Golf', hint: 'Usar tacos para acertar uma bolinha em buracos no gramado com poucas tacadas.' },
      { text: 'Handebol', hint: 'Esporte de quadra jogado com as mãos tentando fazer gols.' },
      { text: 'Beisebol', hint: 'Usar um bastão para rebater a bola lançada e correr pelas bases.' },
      { text: 'Automobilismo', hint: 'Competição de corrida com carros de alta velocidade.' },
      { text: 'Ginástica', hint: 'Envolve acrobacias e movimentos de flexibilidade extrema.' }
    ]
  }
];
