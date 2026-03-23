import java.sql.*;
public class PgConnCheck {
  public static void main(String[] args) {
    String url = "jdbc:postgresql://ep-muddy-dream-ant9m12i-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channelBinding=require&connectTimeout=5&socketTimeout=5";
    String user = "neondb_owner";
    String pass = "npg_dU4xESCnKG5X";
    try (Connection c = DriverManager.getConnection(url, user, pass)) {
      System.out.println("CONNECTED " + c.getMetaData().getURL());
    } catch (Exception e) {
      e.printStackTrace();
      System.exit(1);
    }
  }
}
