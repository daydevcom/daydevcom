using TMpro;
using UnityEngine;
using UnityEngine.SceneManagement;

public class GameController : MonoBehaviour
{
    public TMP_Text scoreText;
    public GameObject pauseMenu;
    public GameObject[] heartImages;
    public GameObject gameOverPanel;
    public bool isGameOver = false;

    public int hp = 100;
    public int score = 0;

    void Start(){
        gameOverPanel.SetActive(false);
        pauseMenu.SetActive(false);
        UpdateScore(0);
        UpdateHeartUI();
    }

    void Update(){
        if(isGameOver){
            gameOverPanel.SetActive(true);
        }
    }

    public void ApplyDamage(int damage){
        hp -= damage;
        hp = Mathf.Clamp(hp,0,100);
        if(hp <= 0){
            hp = 0;
            GameOver();
        }
    }

    public void UpdateScore(int points){
        score += points;
        scoreText.text = "SCORE: "+score;
    }

    public void UpdateHeartUI(){
        int heartsToShow = Mathf.CeilToInt(hp /20f);
        for (int i = 0; i < heartImages.Length; i++){
            heartImages[i].SetActive(i<heartsToShow);
        }
    }

    public void GameOver(){
        isGameOver = true;
        GameObject player = GameObject.FindWithTag("Player");
        if(player != null){
            Destroy(player);
        }
        if(pauseMenu != null){
            pauseMenu.SetActive(false);
        }
        if(gameOverPanel != null){
            gameOverPanel.GetComponent<GameOverPanel>().ShowGameOverPanel(score);
        }
    }
}