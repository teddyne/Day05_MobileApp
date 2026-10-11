import React from "react";
import { View, Text, Image, Pressable, StyleSheet } from "react-native";

export interface Movie {
  id: string;
  title: string;
  director: string;
  year: number;
  rating: number;
  poster: string;
  watched: boolean;
}

export interface MovieCardProps {
  movie: Movie;
  onSelect: (id: string) => void;
  layout?: "row" | "poster"; // mặc định "row"
}

function MovieCard({ movie, onSelect, layout = "row" }: MovieCardProps) {
  const rating = Number(movie.rating).toFixed(1);

  if (layout === "poster") {
    return (
      <Pressable style={styles.posterCard} onPress={() => onSelect(movie.id)}>
        <View>
          <Image
            source={{ uri: movie.poster }}
            style={styles.posterImage}
            resizeMode="cover"
          />
          <View style={styles.ratingBadge}>
            <Text style={styles.badgeText}>⭐ {rating}</Text>
          </View>
          {movie.watched && (
            <View style={styles.watchedChip}>
              <Text style={styles.badgeText}>✓ Đã xem</Text>
            </View>
          )}
        </View>
        <Text style={styles.posterTitle} numberOfLines={2}>
          {movie.title}
        </Text>
      </Pressable>
    );
  }

  return (
    <Pressable style={styles.rowCard} onPress={() => onSelect(movie.id)}>
      <Image
        source={{ uri: movie.poster }}
        style={styles.rowPoster}
        resizeMode="cover"
      />
      <View style={styles.rowInfo}>
        <Text style={styles.title} numberOfLines={2}>
          {movie.title}
        </Text>
        <Text style={styles.sub}>
          {movie.director} · {movie.year}
        </Text>
        <Text style={styles.rating}>⭐ {rating}</Text>
        <Text style={styles.status}>
          {movie.watched ? "✅ Đã xem" : "🎬 Chưa xem"}
        </Text>
      </View>
    </Pressable>
  );
}

export default React.memo(MovieCard);

const styles = StyleSheet.create({
  // ---- row ----
  rowCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    marginHorizontal: 12,
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  rowPoster: {
    width: 70,
    height: 105,
    borderRadius: 6,
    backgroundColor: "#e0e6ef",
  },
  rowInfo: { flex: 1, marginLeft: 12, justifyContent: "center" },
  title: { fontSize: 16, fontWeight: "700", color: "#1c2333" },
  sub: { fontSize: 13, color: "#667", marginTop: 2 },
  rating: { fontSize: 14, color: "#a05a00", marginTop: 4 },
  status: { fontSize: 14, color: "#222", marginTop: 4 },

  // ---- poster ----
  posterCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  posterImage: {
    width: "100%",
    aspectRatio: 2 / 3,
    borderRadius: 8,
    backgroundColor: "#e0e6ef",
  },
  posterTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1c2333",
    marginTop: 8,
    marginBottom: 2,
  },
  ratingBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: "rgba(40,40,40,0.85)",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  watchedChip: {
    position: "absolute",
    bottom: 6,
    left: 6,
    backgroundColor: "#22a559",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: { color: "#fff", fontSize: 12, fontWeight: "700" },
});
