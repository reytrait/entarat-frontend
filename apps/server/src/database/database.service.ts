import { Injectable, type OnModuleInit } from "@nestjs/common";
import type { RedisService } from "../redis/redis.service";
import type { Game, Player, Question } from "../types/game";

@Injectable()
export class DatabaseService implements OnModuleInit {
	games = new Map<string, Game>();
	players = new Map<string, Player>();
	questions: Question[] = [
		{
			id: 1,
			question: "Which planet is known as the Red Planet?",
			image:
				"https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/OSIRIS_Mars_true_color.jpg/360px-OSIRIS_Mars_true_color.jpg",
			options: ["Mars", "Jupiter", "Saturn", "Venus"],
			correctAnswer: 0,
			category: "Science",
		},
		{
			id: 2,
			question: "What is the largest ocean on Earth?",
			image:
				"https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Ocean_Beach.jpg/1600px-Ocean_Beach.jpg",
			options: ["Atlantic", "Pacific", "Indian", "Arctic"],
			correctAnswer: 1,
			category: "Geography",
		},
		{
			id: 3,
			question: "Who painted the Mona Lisa?",
			image:
				"https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Mona_Lisa.jpg/960px-Mona_Lisa.jpg",
			options: ["Van Gogh", "Picasso", "Da Vinci", "Monet"],
			correctAnswer: 2,
			category: "Art",
		},
		{
			id: 4,
			question: "What is the capital of France?",
			image:
				"https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/La_Tour_Eiffel_vue_de_la_Tour_Saint-Jacques%2C_Paris_ao%C3%BBt_2014_%282%29.jpg/800px-La_Tour_Eiffel_vue_de_la_Tour_Saint-Jacques%2C_Paris_ao%C3%BBt_2014_%282%29.jpg",
			options: ["London", "Berlin", "Paris", "Madrid"],
			correctAnswer: 2,
			category: "Geography",
		},
		{
			id: 5,
			question: "Which gas do plants absorb from the atmosphere?",
			image:
				"https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Starr_070730-6095_Hibiscus_rosa-sinensis.jpg/800px-Starr_070730-6095_Hibiscus_rosa-sinensis.jpg",
			options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
			correctAnswer: 2,
			category: "Science",
		},
		{
			id: 6,
			question: "In which year did World War II end?",
			image:
				"https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/V-J_Day_in_Times_Square.jpg/800px-V-J_Day_in_Times_Square.jpg",
			options: ["1943", "1944", "1945", "1946"],
			correctAnswer: 2,
			category: "History",
		},
		{
			id: 7,
			question: "What is the largest mammal in the world?",
			image:
				"https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Humpback_Whale_underwater_shot.jpg/800px-Humpback_Whale_underwater_shot.jpg",
			options: ["Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
			correctAnswer: 1,
			category: "Science",
		},
		{
			id: 8,
			question: "Which planet is closest to the Sun?",
			image:
				"https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Mercury_in_color_-_Prockter07_centered.jpg/800px-Mercury_in_color_-_Prockter07_centered.jpg",
			options: ["Venus", "Mercury", "Earth", "Mars"],
			correctAnswer: 1,
			category: "Science",
		},
		{
			id: 9,
			question: "What is the chemical symbol for gold?",
			image:
				"https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Gold_crystals.jpg/800px-Gold_crystals.jpg",
			options: ["Go", "Gd", "Au", "Ag"],
			correctAnswer: 2,
			category: "Science",
		},
		{
			id: 10,
			question: "Which ocean is between America and Europe?",
			image:
				"https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Atlantic_Ocean_-_en.png/800px-Atlantic_Ocean_-_en.png",
			options: ["Pacific", "Atlantic", "Indian", "Arctic"],
			correctAnswer: 1,
			category: "Geography",
		},
		{
			id: 11,
			question: "What is the smallest country in the world?",
			image:
				"https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/St_Peter%27s_Square%2C_Vatican_City_-_April_2007.jpg/800px-St_Peter%27s_Square%2C_Vatican_City_-_April_2007.jpg",
			options: ["Monaco", "Vatican City", "San Marino", "Liechtenstein"],
			correctAnswer: 1,
			category: "Geography",
		},
		{
			id: 12,
			question: "Who wrote 'Romeo and Juliet'?",
			image:
				"https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Shakespeare.jpg/800px-Shakespeare.jpg",
			options: [
				"Charles Dickens",
				"William Shakespeare",
				"Jane Austen",
				"Mark Twain",
			],
			correctAnswer: 1,
			category: "Literature",
		},
		{
			id: 13,
			question: "What is the hardest natural substance on Earth?",
			image:
				"https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Diamond.jpg/800px-Diamond.jpg",
			options: ["Gold", "Iron", "Diamond", "Platinum"],
			correctAnswer: 2,
			category: "Science",
		},
		{
			id: 14,
			question: "In which sport would you perform a slam dunk?",
			image:
				"https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Basketball.png/800px-Basketball.png",
			options: ["Football", "Basketball", "Tennis", "Soccer"],
			correctAnswer: 1,
			category: "Sports",
		},
		{
			id: 15,
			question: "What is the capital of Japan?",
			image:
				"https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Tokyo_Tower_and_around_Skyscrapers.jpg/800px-Tokyo_Tower_and_around_Skyscrapers.jpg",
			options: ["Seoul", "Beijing", "Tokyo", "Bangkok"],
			correctAnswer: 2,
			category: "Geography",
		},
		{
			id: 16,
			question: "How many continents are there?",
			image:
				"https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/World_map_blank_without_borders.svg/800px-World_map_blank_without_borders.svg.png",
			options: ["5", "6", "7", "8"],
			correctAnswer: 2,
			category: "Geography",
		},
		{
			id: 17,
			question: "What is the speed of light in vacuum?",
			image:
				"https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Sun_in_X-Ray.png/800px-Sun_in_X-Ray.png",
			options: ["300,000 km/s", "150,000 km/s", "450,000 km/s", "600,000 km/s"],
			correctAnswer: 0,
			category: "Science",
		},
		{
			id: 18,
			question: "Which artist painted 'Starry Night'?",
			image:
				"https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/800px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg",
			options: ["Picasso", "Van Gogh", "Monet", "Da Vinci"],
			correctAnswer: 1,
			category: "Art",
		},
		{
			id: 19,
			question: "What is the longest river in the world?",
			image:
				"https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Nile_River_and_delta_from_orbit.jpg/800px-Nile_River_and_delta_from_orbit.jpg",
			options: ["Amazon", "Nile", "Mississippi", "Yangtze"],
			correctAnswer: 1,
			category: "Geography",
		},
		{
			id: 20,
			question: "How many sides does a hexagon have?",
			image:
				"https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Regular_hexagon.svg/800px-Regular_hexagon.svg.png",
			options: ["5", "6", "7", "8"],
			correctAnswer: 1,
			category: "Math",
		},
		{
			id: 21,
			question: "What is the main ingredient in guacamole?",
			image:
				"https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Guacamole_2.jpg/800px-Guacamole_2.jpg",
			options: ["Tomato", "Avocado", "Onion", "Pepper"],
			correctAnswer: 1,
			category: "Food",
		},
		{
			id: 22,
			question: "Which planet is known as the 'Red Planet'?",
			image:
				"https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/OSIRIS_Mars_true_color.jpg/800px-OSIRIS_Mars_true_color.jpg",
			options: ["Venus", "Mars", "Jupiter", "Saturn"],
			correctAnswer: 1,
			category: "Science",
		},
		{
			id: 23,
			question: "What is the largest desert in the world?",
			image:
				"https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Sahara_desert.jpg/800px-Sahara_desert.jpg",
			options: ["Gobi", "Sahara", "Antarctic", "Arabian"],
			correctAnswer: 2,
			category: "Geography",
		},
		{
			id: 24,
			question: "Who invented the telephone?",
			image:
				"https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Alexander_Graham_Bell.jpg/800px-Alexander_Graham_Bell.jpg",
			options: [
				"Thomas Edison",
				"Alexander Graham Bell",
				"Nikola Tesla",
				"Guglielmo Marconi",
			],
			correctAnswer: 1,
			category: "History",
		},
		{
			id: 25,
			question: "What is the capital of Australia?",
			image:
				"https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Parliament_House_Canberra_ACT.jpg/800px-Parliament_House_Canberra_ACT.jpg",
			options: ["Sydney", "Melbourne", "Canberra", "Brisbane"],
			correctAnswer: 2,
			category: "Geography",
		},
		{
			id: 26,
			question: "How many hearts does an octopus have?",
			image:
				"https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Octopus2.jpg/800px-Octopus2.jpg",
			options: ["1", "2", "3", "4"],
			correctAnswer: 2,
			category: "Science",
		},
		{
			id: 27,
			question: "What is the smallest prime number?",
			image:
				"https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Prime_number_spiral.svg/800px-Prime_number_spiral.svg.png",
			options: ["0", "1", "2", "3"],
			correctAnswer: 2,
			category: "Math",
		},
		{
			id: 28,
			question: "Which movie won the Academy Award for Best Picture in 2020?",
			image:
				"https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Oscar_statue.jpg/800px-Oscar_statue.jpg",
			options: ["Joker", "Parasite", "1917", "Once Upon a Time in Hollywood"],
			correctAnswer: 1,
			category: "Entertainment",
		},
		{
			id: 29,
			question: "What is the chemical formula for water?",
			image:
				"https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Water_drop_001.jpg/800px-Water_drop_001.jpg",
			options: ["H2O", "CO2", "NaCl", "O2"],
			correctAnswer: 0,
			category: "Science",
		},
		{
			id: 30,
			question: "Which country is home to the kangaroo?",
			image:
				"https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Kangaroo_and_joey03.jpg/800px-Kangaroo_and_joey03.jpg",
			options: ["New Zealand", "Australia", "South Africa", "Brazil"],
			correctAnswer: 1,
			category: "Geography",
		},
	];

	constructor(private readonly redisService: RedisService) {}

	async onModuleInit() {
		// Load any cached games from Redis on startup
		if (this.redisService.isAvailable()) {
			await this.loadGamesFromRedis();
		}
	}

	/**
	 * Load games from Redis cache
	 */
	private async loadGamesFromRedis(): Promise<void> {
		try {
			const gameKeys = await this.redisService.keys("game:*");
			for (const key of gameKeys) {
				const gameId = key.replace("game:", "");
				const game = await this.redisService.getCachedGame(gameId);
				if (game) {
					this.games.set(gameId, game);
				}
			}
		} catch (error) {
			console.error("Error loading games from Redis:", error);
		}
	}

	/**
	 * Save game to Redis cache
	 */
	async saveGameToCache(gameId: string, game: Game): Promise<void> {
		// Save to in-memory map
		this.games.set(gameId, game);

		// Save to Redis cache (1 hour TTL)
		if (this.redisService.isAvailable()) {
			await this.redisService.cacheGame(gameId, game, 3600);
		}
	}

	/**
	 * Get game from cache or memory
	 */
	async getGame(gameId: string): Promise<Game | undefined> {
		// First check in-memory
		if (this.games.has(gameId)) {
			return this.games.get(gameId);
		}

		// If not in memory, try Redis
		if (this.redisService.isAvailable()) {
			const cached = await this.redisService.getCachedGame(gameId);
			if (cached) {
				this.games.set(gameId, cached);
				return cached;
			}
		}

		return undefined;
	}

	/**
	 * Save player to Redis cache
	 */
	async savePlayerToCache(playerId: string, player: Player): Promise<void> {
		// Save to in-memory map
		this.players.set(playerId, player);

		// Save to Redis cache (1 hour TTL)
		if (this.redisService.isAvailable()) {
			await this.redisService.cachePlayer(playerId, player, 3600);
		}
	}

	/**
	 * Get player from cache or memory
	 */
	async getPlayer(playerId: string): Promise<Player | undefined> {
		// First check in-memory
		if (this.players.has(playerId)) {
			return this.players.get(playerId);
		}

		// If not in memory, try Redis
		if (this.redisService.isAvailable()) {
			const cached = await this.redisService.getCachedPlayer(playerId);
			if (cached) {
				this.players.set(playerId, cached);
				return cached;
			}
		}

		return undefined;
	}

	/**
	 * Invalidate game cache
	 */
	async invalidateGameCache(gameId: string): Promise<void> {
		this.games.delete(gameId);
		if (this.redisService.isAvailable()) {
			await this.redisService.invalidateGameCache(gameId);
		}
	}
}
