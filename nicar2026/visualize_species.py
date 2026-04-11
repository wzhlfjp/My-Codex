import sqlite3
import textwrap

import matplotlib.pyplot as plt


DB_PATH = "trees.db"
OUTPUT_PATH = "most_common_tree_species.png"
TOP_N = 10


def load_species_counts(db_path: str, top_n: int) -> list[tuple[str, int]]:
    query = """
    select
      qSpecies,
      count(*) as count
    from trees
    where qSpecies is not null
      and trim(qSpecies) != ''
      and qSpecies != 'Tree(s) ::'
    group by qSpecies
    order by count desc
    limit ?
    """
    with sqlite3.connect(db_path) as conn:
        return conn.execute(query, (top_n,)).fetchall()


def shorten_species_name(name: str) -> str:
    common_name = name.split("::", 1)[-1].strip() if "::" in name else name.strip()
    return "\n".join(textwrap.wrap(common_name, width=26))


def main() -> None:
    rows = load_species_counts(DB_PATH, TOP_N)
    labels = [shorten_species_name(name) for name, _count in rows]
    counts = [count for _name, count in rows]

    plt.style.use("ggplot")
    fig, ax = plt.subplots(figsize=(12, 7))
    bars = ax.barh(labels, counts, color="#2f7f5f")
    ax.invert_yaxis()

    ax.set_title("Most Common Tree Species in San Francisco Street Tree Data", pad=14)
    ax.set_xlabel("Number of Trees")
    ax.set_ylabel("Species")

    for bar, count in zip(bars, counts):
        ax.text(
            bar.get_width() + 80,
            bar.get_y() + bar.get_height() / 2,
            f"{count:,}",
            va="center",
            fontsize=10,
        )

    fig.tight_layout()
    fig.savefig(OUTPUT_PATH, dpi=200, bbox_inches="tight")


if __name__ == "__main__":
    main()
