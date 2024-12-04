using UnityEngine;
using TMPro;
using UnityEngine.SceneManagement;
public class GameOverPanel : MonoBehaviour
{
    [Header("UI Elements")]
    public TMP_Text scoreText;
    public TMP_Text highScoreText;

    void Start()
    {
        gameObject.SetActive(false);
    }

    void Update()
    {
        if(Input.GetKeyDown(KeyCode.Return) || GetButtonDown("Submit")){
            GoToTitle();
        }
    }

    public void ShowGameOverPanel(int score){
        scoreText.text = $"SCORE: {score}";
        int highScore = PlayerPrefs.GetInt("HighScore",0);
        if(score > highScore){
            highScore = score;
            highScore = PlayerPrefs.SetInt("HighScore",highScore);
            PlayerPrefs.Save();
        }
    }
}
